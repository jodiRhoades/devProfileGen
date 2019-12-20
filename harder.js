const inquirer = require("inquirer");
const fs = require("fs");
const { promisify } = require("util");
const axios = require("axios");
const pdfkit = require("pdfkit");

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
    const pdfkit = makepdf(profileData.data, favColor);
    console.log(pdfkit)

    fs.writeFile(`${profileData.data.login}.pdf`, pdfkit, (err) => {
        if (err) throw err
        console.log("wrote the file")
    });
};

function makepdf(userInfo, color) {
    return `# <span style="color:${color}"> ${userInfo.name}</span>  
<img src="${userInfo.avatar_url}" alt="coder photo" height="75"><br>
Username: ${userInfo.login}  
Location Map: [google link](${https://www.google.com/maps/place/Charlotte,+NC/@35.2030728,-80.9799136,11z/data=!3m1!4b1!4m5!3m4!1s0x88541fc4fc381a81:0x884650e6bf43d164!8m2!3d35.2270869!4d-80.8431267})  
Profile URL: [profile link]({$userInfo.html_url})
Blog: ${userInfo.Blog}
Bio: ${userInfo.bio}  
// Repo URL: [repo link](${userInfo.html_url})  
Public Repos:  ${userInfo.public_repos}  
Followers: ${userInfo.followers}  
GitHub stars: ${userInfo.stargazers_count}
Following: ${userInfo.following}  
`
}

promptUser();