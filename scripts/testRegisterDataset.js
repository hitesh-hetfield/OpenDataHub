const path = require("path");
const fs = require("fs");
const hre = require("hardhat");

async function contractInteraction()  {
    const env = process.env.NODE_ENV;
    const networkName = hre.network.name;

    const filepath = path.join(
        __dirname,
        `../deployed-contracts/${env}.${networkName}.decMKT.json`
    );

    const mktData = JSON.parse( fs.readFileSync(filepath, "utf-8") );
    const proxyContract = mktData.proxyAddress;

    console.log(proxyContract); // proxy address for the marketplace

    const mkt = await hre.ethers.getContractFactory("decMKT");
    const MKT = mkt.attach(proxyContract);

    const tx = await MKT.registerDataset(
        "Breat Cancer Dataset",
        "bafybeibhqit7sy36g7posi2mbaclrsoctcfzpxrhf4lb22ct3dmihrzzki"
    );

    console.log("Dataset Registration Initiated...");
    await tx.wait();

    console.log("Dataset Registered");
    console.log("Transaction hash:", tx.hash);
}

(async () => {
    try {
        await contractInteraction();
    } catch(error) {
        console.error(error.message);    
    }
})();
