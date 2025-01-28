const { connectToContract } = require("./connectToContract.js");
const { uploadCSV } = require("./testPinata.js");
require("dotenv").config();

async function uploadAndRegister(filePath, fileName, sellingPrice) {

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
        
    } catch(error) {
        console.error(error.message);
    }
}

module.exports = { uploadAndRegister };