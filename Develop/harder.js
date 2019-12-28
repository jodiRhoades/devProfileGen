const inquirer = require("inquirer");
const fs = require("fs");
const { promisify } = require("util");
const axios = require("axios");
const pdf = require("html-pdf");
const { generateHTML } = require('./generateHTML')
const options = { format: 'Letter' };
const writeFileAsync = promisify(fs.writeFile);

async function promptUser() {
    try {
        const data = await inquirer.prompt([
            {
                type: "list",
                name: "favColor",
                message: "What is your favorite color?",
                choices: [
                    "red",
                    "blue",
                    "pink",
                    "green"
                ]
            },
            {
                type: "input",
                name: "github",
                message: "Enter your GitHub Username"
            }

        ]);
        const { github, favColor } = data;

        const profileData = await axios.get(`https://api.github.com/users/${github}`)

        profileData.data.color = favColor;

        const pdfText = generateHTML(profileData.data);
        console.log(pdfText)

        fs.writeFile("test.HTML", pdfText, err => {
            if (err) throw err
            console.log("success")
        })
        pdf.create(pdfText, options).toFile('generateHTML.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res);
        });        
    } 
    catch(err) {
        console.log(err)
    }
   };

promptUser();