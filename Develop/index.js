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
            name: "name",
            message: "What is your name?"
        },
        {
            type: "input",
            name: "github",
            message: "Enter your GitHub Username"
        }

    ]);
    let { github } = data;

    let profileData = axios.get(`https://api.github.com/users/${github}`);
    console.log(profileData)
    // let markdown = makeMarkdown(profileData.data);
    // console.log(profileData.data)


    // writeFileAsync("github.md", markdown);


};
// function makeMarkdown(userImage, userProfile, location, userBio, publicRepos, followers, following) {
//     this.userImage = userImage;
//     this.userProfile = userProfile;
//     this.location = location;
//     this.userBio = userBio;
//     this.publicRepos = publicRepos;
//     this.followers = followers;
//     this.following = following;

//     makeMarkdown.prototype.printStats = function() {
//         console.log("")
//     }



promptUser();