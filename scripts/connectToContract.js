const fs = require("fs"); 
const path = require("path");
const _abi = require("../mkt.abi.json");
const hre = require("hardhat");

const env = process.env.NODE_ENV;
const networkName = hre.network.name;

const filepath = path.join(
    __dirname,
    `../deployed-contracts/${env}.${networkName}.decMKT.json`
);

const mktData = JSON.parse(fs.readFileSync( filepath, "utf-8" ));
const proxyContract = mktData.proxyAddress;


async function connectToContract() {

    const mkt = await hre.ethers.getContractFactory("decMKTV2");
    const MKT = mkt.attach(proxyContract);

    return MKT;
}

module.exports = { connectToContract };