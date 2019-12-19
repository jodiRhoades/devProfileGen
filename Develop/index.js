const inquirer = require("inquirer");
const fs = require("fs");
const { promisify } = require("util");
const axios = require("axios");
const markdown = require("markdown");

const writeFileAsync = promisify(fs.writeFile);

async function promptUser() {
    const data = await inquirer.prompt([
        {
            type: "input",
            name: "favColor",
            message: "What is your favorite color?"
        },
        {
            type: "input",
            name: "github",
            message: "Enter your GitHub Username"
        }

    ]);
    const { github, favColor } = data;

    console.log(favColor)
    const profileData = await axios.get(`https://api.github.com/users/${github}`)
    console.log(profileData)
    const markdown = makeMarkdown(profileData.data, favColor);
    console.log(markdown)

    fs.writeFile(`${profileData.data.name}.md`, markdown, (err) => {
        if (err) throw err
        console.log("wrote the file")
    });
};

function makeMarkdown(userInfo, color) {
    return `# <span style="color:${color}"> ${userInfo.name}</span>  
<img src="${userInfo.avatar_url}" alt="coder photo" height="75"><br>
Username: ${userInfo.login}  
Bio: ${userInfo.bio}  
Repo URL: [repo link](${userInfo.html_url})  
Public Repos:  ${userInfo.public_repos}  
Followers: ${userInfo.followers}  
Following: ${userInfo.following}  
`
}

promptUser();