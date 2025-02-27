/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import {writeFile, createWriteStream} from "node:fs";
import inquirer from "inquirer";
import {image} from "qr-image";

inquirer.prompt([
    { 
        message: "Please enter a URL to be turned into a QR code!",
        name: "URL",
    }
]).then((answers) => {
    var url = answers.URL;
    var qrCode = image(url);
    qrCode.pipe(createWriteStream('qr_code.png'));
    writeFile("URL.txt", url, err => {
        if(err)
            throw err;
        console.log(`User input \"${url}\" written to URL.txt`);
    });
}).catch((error) => {
    if(error.isTtyError)
        console.log("Prompt couldn't be rendered in the current environment.");
    else
        throw error;
});
