const fs = require('fs');
const zlib = require('zlib');

exports.extractFiles = async function extractWmzFiles (mhtFile) {

    const fileData = await new Promise((resolve, reject) => {
        fs.readFile(mhtFile,  (error, data) => {
            if (error) {
                reject(error);
            }
            
            resolve(data);
        });
    });
    
    const fileParts = fileData.toString().split(/--=_NextP.*\r\n/g);
    const wmfFiles = [];

    for(const part of fileParts) {
        if (part.includes("Content-Type: image/x-wmz")) {
            const partLines = part.split(/\r?\n/);
            const fileNameParts = partLines[0].split("/");
            const name = fileNameParts.slice(fileNameParts.length - 2).join("_");

            let wmzFileBase64 = '';

            for (let j = 4; j < partLines.length - 2; j += 1) {
                wmzFileBase64 += partLines[j];
            }

            const wmzFile = Buffer.from(wmzFileBase64, 'base64');

            const wmfBuffer = await new Promise((resolve, reject) => {
                zlib.gunzip(wmzFile, function (err, data) {
                    if (err) {
                        reject(err);
                    }

                    resolve(data);
                });
            });

            wmfFiles.push({
                name,
                wmfBuffer
            });
        }    
    };

    return wmfFiles;
}
