const { PinataSDK } = require("pinata-web3");
const fs = require("fs");
const mime = require("mime-types"); 
require("dotenv").config();
const Papa = require("papaparse");

const pinata = new PinataSDK({
    pinataJwt: process.env.JWT,
    pinataGateway: process.env.GATEWAY_URL
});

async function uploadCSV(filePath, fileName) {
    if( mime.lookup(filePath) === "text/csv") {
        try {
            const readFile = fs.readFileSync(filePath);
            const file = new File([readFile], fileName, { type: "text/csv" });
    
            const uploadFile = await pinata.upload.file(file);
            // console.log(uploadFile);
            const ipfsHash = uploadFile.IpfsHash;
            return ipfsHash;
    
        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.log("File type is not csv");
    }    
}

async function getData(ipfsHash) {
    try {
        const rawData = await pinata.gateways.get(ipfsHash);
        console.log(rawData);
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = { uploadCSV, getData };