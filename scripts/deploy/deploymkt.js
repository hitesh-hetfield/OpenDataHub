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

    const mkt = await ethers.getContractFactory("decMKT");
    const MKT = await upgrades.deployProxy(
        mkt,
        [],
        { 
            kind: "uups",
            initializer: "initialize"
         }
    );

    await MKT.waitForDeployment();
    const proxyAddress = MKT.target;
    console.log("PROXY for Decentralized Marketplace for Datasets deployed at:", proxyAddress);

    const impAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

    await hre.run("verify:verify", {
        address: impAddress,
        constructorArguments: []
    });

    await hre.run("verify:verify", {
        address: proxyAddress,
        constructorArguments: []
    });

    const decMktAddress = {
        proxyAddress: MKT.target,
        implementationAddress: impAddress,
        network: networkName
    };

    const folderpath = path.join(
        __dirname,
        "../../deployed-contracts"
    );

    if(!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath, { recursive: true });
    }

    const filepath = path.join(
        folderpath,
        `${env}.${networkName}.decMKT.json`
    );

    fs.writeFileSync(
        filepath,
        JSON.stringify(decMktAddress, null, 2)
    );

}

deployMkt().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  }); 