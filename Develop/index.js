// TODO: Include packages needed for this application

const inquirer = require("inquirer");
const fs = require("fs");

const generateREADME = (data) =>
  `# ${data.projectName}
  
  ## Description
  
  ${data.projectDescription}`;

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
  ])
  .then((answers) => {
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
