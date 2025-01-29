const path = require("path");
const { connectToContract } = require("./connectToContract.js");
const { uploadCSV } = require("./testPinata.js");
const fs = require("fs");
const hre = require("hardhat");
require("dotenv").config();

async function uploadAndRegister(filePath, fileName, sellingPrice) {

    const env = process.env.NODE_ENV;
    const networkName = hre.network.name;

    try {
        // upload to IPFS
        console.log("\nUploading file to IPFS...");
        const datasetHash = await uploadCSV(filePath, fileName);
    
        // connect to Smart Contract
        console.log("Connecting to Smart Contract...");
        const contract = await connectToContract();
        
        //Registering the Dataset
        console.log("Registering Dataset...\n");
        const testRegister = await contract.registerDatasetV2 (
            fileName,
            datasetHash,
            sellingPrice
        );

        await testRegister.wait();
        console.log(`Dataset ${fileName} successfully registered with hash: ${datasetHash}`);

        const getData = await contract.getDataset(datasetHash);
        const datasetNumber = getData[0].toString();

        // store the hash of the dataset
        const datasetInfo = {
            datasetId: datasetNumber,
            datasetHash: datasetHash,
            datasetName: fileName,
        };

        const folderpath = path.join(
            __dirname,
            "../dataset-info"
        );

        if(!fs.existsSync(folderpath)) {
            fs.mkdirSync(folderpath, { recursive: true });
        }
        
        const filepath = path.join(
            folderpath,
            `${env}.${networkName}.json`
        );

        let storedData = [];
        if (fs.existsSync(filepath)) {
            try {
                const fileContents = fs.readFileSync(filepath, "utf-8");
                storedData = JSON.parse(fileContents);
                if (!Array.isArray(storedData)) storedData = []; // Ensure it's an array
            } catch (error) {
                console.error("Error reading JSON file:", error.message);
                storedData = []; // Ensure storedData is an array even if parsing fails
            }
        }

        // Append new dataset info
        storedData.push(datasetInfo);
        

        fs.writeFileSync(
            filepath,
            JSON.stringify(storedData, null, 2)
        );

        console.log("Dataset stored in json file");
        
        
    } catch(error) {
        console.error(error.message);
    }
}

module.exports = { uploadAndRegister };