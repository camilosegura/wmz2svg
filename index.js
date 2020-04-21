const fs = require('fs')
const extractWmzFiles = require("./extract-wmz-files");

const args = process.argv.slice(2);

(async function main(args) {
    if (args.length != 2) {
        throw new Error("This file requires the first input to be a HTM file and a destination folder");
    }
    
    const wmfFiles = await extractWmzFiles.extractFiles(args[0]);

    wmfFiles.forEach(wmfFile => {
        fs.writeFile(wmfFile.fileName, wmfFile.wmfFile, (err) => {
            if (err) {
                throw new Error(err);
            }
        })
    })
    

})(args);