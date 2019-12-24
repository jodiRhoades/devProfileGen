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

        const pdfText = generateHTML(profileData.data, favColor);
        console.log(pdfText)

        pdf.create(pdfText, options).toFile('generateHTML.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res);
        });

        catch(err) {
            console.log(err)
        }

    } 
   };

function makepdf(userInfo, color) {
    return `# <span style="color:${color}"> ${userInfo.name}</span>  
<img src="${userInfo.avatar_url}" alt="coder photo" height="75"><br>
Name: ${userInfo.name}
Username: ${userInfo.login}  
Location Map: [google link](${'https://www.google.com/maps/place/Charlotte,+NC/@35.2030728,-80.9799136,11z/data=!3m1!4b1!4m5!3m4!1s0x88541fc4fc381a81:0x884650e6bf43d164!8m2!3d35.2270869!4d-80.8431267'})  
Profile URL: [profile link](${userInfo.html_url})  
Blog URL: [blog link] ${userInfo.html_url}
Bio: ${userInfo.bio}  
Repo URL: [repo link](${userInfo.repos_url})  
Public Repos:  ${userInfo.public_repos}  
Followers: ${userInfo.followers}  
GitHub stars: ${userInfo.watchers_count}
Following: ${userInfo.following}  
`
}

promptUser();