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

    const readFilepath = path.join(
        __dirname,
        `../../deployed-contracts/${env}.${networkName}.decMKT.json`
    );

    const mktJSON = JSON.parse(
        fs.readFileSync(
            readFilepath,
            "utf-8"
        )
    );

    const PROXY = mktJSON.proxyAddress;

    const mktV2 = await ethers.getContractFactory("decMKTV2");
    const MKTV2 = await upgrades.upgradeProxy(
        PROXY,
        mktV2,
        {
            kind: "uups",
            initializer: "initializeV2"
        }
    );

    await MKTV2.waitForDeployment();
    const newImpAddress = await upgrades.erc1967.getImplementationAddress(PROXY);

    await hre.run("verify:verify", {
        address: newImpAddress,
        constructorArguments: []
    });

    // await hre.run("verify:verify", {
    //     address: proxyAddress,
    //     constructorArguments: []
    // });

    // const decMktAddress = {
    //     proxyAddress: MKT.target,
    //     implementationAddress: impAddress,
    //     network: networkName
    // };

    // fs.writeFileSync(
    //     filepath,
    //     JSON.stringify(decMktAddress, null, 2)
    // );

}

deployMkt().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });