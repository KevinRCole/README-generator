// TODO: Include packages needed for this application

// have to use "import" instead of "require", in order to also use fetch
import inquirer from 'inquirer';
import fs from 'fs';
import fetch from 'node-fetch';

// fetch list of licenses from GitHub API
const response = await fetch('https://api.github.com/licenses');
const data = await response.json();
const licenseList = data;


// generate an array of objects consisting of the formal names and url's of the licenses
const licenseNames = [];
const generateLicenseList = function() {
for (let i=0; i < licenseList.length; i++) {
    let eachLicense = {name: licenseList[i].name, value: licenseList[i].url}
    // let eachLicense = {value: licenseList[i].url, name: licenseList[i].name}
    licenseNames.push(eachLicense);
  }

  // creatie first object of array to cover situtation where user selects "None" for license
  // TA Jessica W helped me debug lines 25 through 27. 
  const choseNoLicense = {name: "None", value: "No URL"};
  licenseNames.unshift(choseNoLicense);
  console.log(licenseNames);
  
};

generateLicenseList();

// I came up with idea of using a second fetch to get move complete license data from GitHub API after user makes license selection,
// but I couldn't get the second fetch to work correctly, after trying it in different locations in the code.  So I asked TA Jessica W
// for help, and she provided the code for the async function, lines 35 through 39.

async function fetchLicense(answers) {
    const response = await fetch(answers.license);
    const data = await response.json();
    // console.log(data);
    return { ...answers, data}
} 


// Start building the guts of the README.md file

const generateREADME = (data) =>

  `# ${data.projectName}    
  
  ## Description
  
  ${data.projectDescription}
  
  ## License
  
  
  ${data.data.name}
  
  ${data.data.description} `;





// use inquirer to get input from the user to build the README.md file with

inquirer
  .prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is the name of your project?",
    },
    {
      type: "input",
      name: "projectDescription",
      message: "Please provide a short description of your project, explaining your motivation, why you built this project, what problem does it solve, and what did you learn.",
    },
    {
        type: "list",
        name: "license",
        message: "Please select the type of license you have for your project.",
        choices: licenseNames,

    }
  ])

  .then((answers) => {
    
    // I came up with idea of having two fetches, to get complete license API data from Github, but could not get them to work.
    // So I asked TA Jessica W for help.  She came up with idea of having two .then functions, which I did not consider, and she provided the code for the first .then function.
    // I subsequently tried to include an if statement in the first .then function, to cover situation in which a user chooses not to select a license,
    // but I couldn't get it to work, so I asked Jessica for help again.  Jessica provided lines 97 through 106.  The use of the spread operator here is
    // is something I did not consider.

    if (answers.license !== "No URL") {
        let data = fetchLicense(answers);
    
        return data;
    } else {
      return { 
        ...answers, data: {name: "None", description: "No license selected" },
      };
    }
  })

  .then((answers) => {

    console.log("answers: ", answers);

    const readmePageContent = generateREADME(answers);

    fs.writeFile("README.md", readmePageContent, (err) =>
      err ? console.log(err) : console.log("Successfully created README.md!")
    );
  });





// TODO: Create an array of questions for user input
// const questions = [];

// TODO: Create a function to write README file
// function writeToFile(fileName, data) {}

// TODO: Create a function to initialize app
// function init() {}

// Function call to initialize app
// init();
