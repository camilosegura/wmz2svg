const fs = require('fs');
const os = require('os');
const path = require('path');

exports.saveFile = async function saveFile(file) {
    const filePath = path.join(os.tmpdir(), file.name);
    console.log("file.wmfFile", file.wmfBuffer)
    await new Promise((resolve, reject) => {
        fs.writeFile(filePath, file.wmfBuffer, (err) => {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });

    return filePath;
};

exports.readFile = async function readFile(filePath) {
    const fileBuffer = await new Promise((resolve, reject) => {
        fs.readFile(filePath,  (error, data) => {
            if (error) {
                reject(error);
            }

            resolve(data);
        })
    });

    return fileBuffer;
}