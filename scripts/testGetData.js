const path = require("path");
const { connectToContract } = require("./connectToContract.js");
const { uploadCSV } = require("./testPinata.js");
const fs = require("fs");
const hre = require("hardhat");
require("dotenv").config();

async function uploadAndRegister() {

    const env = process.env.NODE_ENV;
    const networkName = hre.network.name;

    try {
    
        // connect to Smart Contract
        console.log("Connecting to Smart Contract...");
        const contract = await connectToContract();

        const getData = await contract.getDataset(""); // insert dataset hash
        console.log(getData[0].toString());

        // store the hash of the dataset
        // const datasetInfo = {
        //     datasetName: fileName,
        //     datasetHash: datasetHash
        // };

        // const folderpath = path.join(
        //     __dirname,
        //     "../dataset-info"
        // );

        // if(!fs.existsSync(folderpath)) {
        //     fs.mkdirSync(folderpath, { recursive: true });
        // }
        
        // const filepath = path.join(
        //     folderpath,
        //     `${env}.${networkName}.json`
        // );

        // fs.writeFileSync(
        //     filepath,
        //     JSON.stringify(datasetInfo, null, 2)
        // );
        
        
    } catch(error) {
        console.error(error.message);
    }
}

// module.exports = { uploadAndRegister };
uploadAndRegister();