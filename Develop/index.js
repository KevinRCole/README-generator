// TODO: Include packages needed for this application

// have to use "import" instead of "require", in order to also use fetch
import inquirer from 'inquirer';
import fs from 'fs';
import fetch from 'node-fetch';
import { NONAME } from 'dns';

// fetch list of licenses from GitHub API
const response = await fetch('https://api.github.com/licenses');
const data = await response.json();
const licenseList = data;


// generate an array of objects consisting of the formal names and url's of the licenses
const licenseNames = [];
const generateLicenseList = function() {
for (let i=0; i < licenseList.length; i++) {
    let eachLicense = {name: licenseList[i].name, value: licenseList[i].url}
    licenseNames.push(eachLicense);
  }

  // create first object of array to cover situtation where user selects "None" for license
// TA Jessica W helped me debug lines 25 through 27. 
const choseNoLicense = {name: "None", value: "No URL"};
licenseNames.unshift(choseNoLicense);
  
};

// function for second fetch to get Github API with more complete information about specific license user selects
generateLicenseList();

// I came up with idea of using a second fetch to get more complete license data from GitHub API for specific license user selects,
// but I couldn't figure out how to get the second fetch to work correctly, after trying it in different locations in the code, and spending a lot of time on it.  So I asked TA Jessica W
// for help, and she provided the code for the async function, lines 37 through 41.

async function fetchLicense(answers) {
    const response = await fetch(answers.license);
    const data = await response.json();
    return { ...answers, data}
} 


// function that creates README.md in template literal
const generateREADME = (data) =>

  
  `# ${data.projectName}

  ${data.badgeUrl}

  ## Description
  
  ${data.projectDescription}

  ## Table Of Contents

  [Installation](#installation)

  [Usage](#usage)

  [Contributing](#contributing)

  [License](#license)

  [Contributing](#contributing)
  
  [Tests](#tests)

  [Questions](#questions)

  
  ## Installation

  ${data.installation}

  ## Usage

  ${data.usage}

  ## Contributing

  ${data.contributing}

  ## License
  
  ${data.data.name}
  
  ${data.data.description}

  ## Tests

  ${data.test}

  ## Questions
  
  Please contact me if you have questions or if you wish to contribute to this project.

  ${data.emailContact}

  ${data.githubProfile}

  `;

// use inquirer to get input from the user to build the README.md file

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
      message: "Write a brief description of your project, in one or two sentences, covering things such as your motivation and reason for working on this project, what problem(s) your project solves, and what you've learned from this project."
    },
        
    {
      type: "input",
      name: "installation",
      message: "What are the steps required to install your project? Provide a step-by-step description of how to get the development environment running. "
    },
    {
      type: "input",
      name: "usage",
      message: "Provide instructions and examples for use."
    },
    {
      type: "list",
      name: "license",
      message: "Please select a type of license for your project.  If you do not wish to select a license, please select 'None.'",
      choices: licenseNames,
    },
    {
      type: "input",
      name: "contributing",
      message:  "Please write a sentence notifying users how they can contribute to this project if they would like."
    },
    {
      type: "input",
      name: "tests",
      message: "Please describe a way to test your project."
    },
    {
      type: "input",
      name: "emailContact",
      message: "Please type your email address so developers can contact you about this project if they wish."
    },
    {
      type: "input",
      name: "githubUsername",
      message: "Please provide your GitHub username to include in your README.md." 
    }
  ])

      
    // I came up with idea of having two fetches, to get complete license API data from Github, but I could not get both fetches to work.
    // So I asked TA Jessica W for help.  She came up with idea of having two .then functions, which I did not consider, and she provided the code for the first .then function.
    // I subsequently tried to include an if statement in the first .then function, to cover situation in which a user chooses not to select a license,
    // but I couldn't get it to work, so I asked Jessica for help again.  Jessica provided me with lines 159 through 173.  The use of the spread operator here is
    // is something I did not consider.
   
    .then((answers) => {

    if (answers.license !== "No URL") {
        let data = fetchLicense(answers);
        return data;
        
    } else {
        
      return { 
          
           ...answers, data: {name: "None", description: "License not selected", spdx_id: "NONE"},
           
        };
        
    }
  })

  .then((answers) => {

    // create "badgeURL" property, with a value equal to the URL of the license badge.
    answers.badgeUrl = "![License badge](https://img.shields.io/static/v1?label=License&message=" + answers.data.spdx_id + "&color=informational)";

    // if user selects "none" from the list of license, the value of badgeURL property is undefined, so no badge will be printed on README.md 
    if (answers.license === "No URL") {
      answers.badgeUrl = ""
      }

    // the following two "if" statements make the hyper links live for the the descriptions of the BSD-2 and BSD-3 badges
    if (answers.data.spdx_id === "BSD-2-Clause") {
        answers.data.description = answers.data.description.replace('<a href="/licenses/bsd-2-clause/">BSD 2-Clause</a> and <a href="/licenses/bsd-3-clause/">BSD 3-Clause</a>', '[BSD 2-Clause](https://choosealicense.com/licenses/bsd-2-clause) and [BSD 3-Clause](https://choosealicense.com/licenses/bsd-3-clause)');
           }      
   
    if (answers.data.spdx_id === "BSD-3-Clause") {
        answers.data.description = answers.data.description.replace('<a href="/licenses/bsd-2-clause/">BSD 2-Clause</a>', '[BSD 2-Clause](https://choosealicense.com/licenses/bsd-2-clause)');
    
      }
    // if user provides an email address, then create an "email.Contact" property, with a value that is equal to the email address wrapped in markup  
    if (answers.emailContact !== "") {
        answers.emailContact = "[Email](mailto:" + answers.emailContact + ")";
        } 

    // if user provides a github username, then create a "githubProfile" property, with a value that is the url of the user's github page wrapped in markup
    if (answers.githubUsername !== "") {
        answers.githubProfile = "[My GitHub page](https://Github.com/" + answers.githubUsername + ")";
        } 

    // generate template literal document from data input by user in response to inquirer prompts 
    const readmePageContent = generateREADME(answers);
    
    // write template literal to a markdown file named "SAMPLE-README.md" in the Develop folderc
    fs.writeFile("SAMPLE-README.md", readmePageContent, (err) =>
      err ? console.log(err) : console.log("Successfully created README.md!")
    );
  });
