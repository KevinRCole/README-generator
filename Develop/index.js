// TODO: Include packages needed for this application

// const inquirer = require("inquirer");
// const fs = require("fs");

import inquirer from 'inquirer';
import fs from 'fs';
import fetch from 'node-fetch';

// fetch list of licenses from GitHub API
const response = await fetch('https://api.github.com/licenses');
const data = await response.json();
const licenseList = data;
console.log(licenseList);

// function to generate an array of objects of the urls of the licenses and the formal names of the licenses
const licenseNames = [];
const generateLicenseList = function() {
for (let i=0; i < licenseList.length; i++) {
    let eachLicense = {name: licenseList[i].name, value: licenseList[i].url}
    // let eachLicense = {value: licenseList[i].url, name: licenseList[i].name}
    licenseNames.push(eachLicense);
    }
};

generateLicenseList();

async function fetchLicense(answers) {
    const response = await fetch(answers.license);
    const data = await response.json();
    console.log(data);
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
    
    let data = fetchLicense(answers)
       
        return data;
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
