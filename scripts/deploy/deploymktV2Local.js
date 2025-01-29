const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs"); 
const path = require("path"); 
require("dotenv").config();

async function deployMkt() {
  
    const deployer = await ethers.provider.getSigner();
    const deployerAddress = await deployer.getAddress();

    console.log("Deploying Decentralized Marketplace for Datasets with address:", deployerAddress);

    const networkName = hre.network.name;
    const env = process.env.NODE_ENV;

    const mkt = await ethers.getContractFactory("decMKTV2");
    const MKT = await upgrades.deployProxy(
        mkt,
        [],
        { 
            kind: "uups",
            initializer: "initializeV2"
         }
    );

    await MKT.waitForDeployment();
    const proxyAddress = MKT.target;
    console.log("PROXY for Decentralized Marketplace for Datasets deployed at:", proxyAddress);

    const impAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("Implementation Address:", impAddress);

}

deployMkt().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  }); 