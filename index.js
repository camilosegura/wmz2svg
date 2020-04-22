const path = require('path');
const extractWmzFiles = require("./extract-wmz-files");
const WMFConverter = require("./wmf2svg");
const storeWmfFile = require("./store-wmf-file");

const args = process.argv.slice(2);

(async function main(args) {
    if (args.length != 2) {
        throw new Error("This file requires the first input to be a HTM file and a destination folder");
    }

    const mhtFile = args[0];
    const outputFolder = args[1];
    const wmfFiles = await extractWmzFiles.extractFiles(mhtFile);
    const wmfFilePaths = [];
    const wmf = new WMFConverter();

    for (let i = 0; i < wmfFiles.length; i += 1) {
        const wmfFilePath = await storeWmfFile.saveFile(wmfFiles[i]);

        wmfFilePaths.push(wmfFilePath);
    }

    for (let i = 0; i < wmfFilePaths.length; i += 1) {
        const wmfFileBuffer = await storeWmfFile.readFile(wmfFilePaths[i]);
        const outputFile = path.join(outputFolder, wmfFiles[i].name.replace(".wmz", ".svg"));

        wmf.toCanvas(wmfFileBuffer.buffer, outputFile);
    }
})(args);