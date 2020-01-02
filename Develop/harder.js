const inquirer = require("inquirer");
const fs = require("fs")
const convertFactory = require('electron-html-to');
const axios = require("axios");
const { generateHTML } = require('./generateHTML')
const path = require("path")
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
 
        var conversion = convertFactory({
            converterPath: convertFactory.converters.PDF
          }); 
        conversion({ html: pdfText  }, function(err, result) {
            if (err) {
              return console.error(err);
            }
           
            console.log(result.numberOfPages);
            console.log(result.logs);
            result.stream.pipe(
                fs.createWriteStream(path.join(__dirname, 'resume.pdf'))
            );
            conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
          });

    } 
    catch(err) {
        console.log(err)
    }
   };

promptUser();