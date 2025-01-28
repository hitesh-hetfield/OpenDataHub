const { ethers } = require("hardhat");
const hre = require("hardhat");
const { connectToContract } = require("./connectToContract.js");
const _abi = require("../mkt.abi.json");
require("dotenv").config();

async function buyDataset() {

    try {    
        const rpcURL = hre.network.config.url;
        const pvtKEY = process.env.DIFF_ADD;

        const provider = new ethers.JsonRpcProvider(rpcURL);
        const user = new ethers.Wallet(pvtKEY, provider);

        const userAddress = user.address
        console.log("Buying with address:", userAddress);

        console.log("Connecting to Contract...");
        // const contractInstance = await connectToContract();
        // const contractAddress = contractInstance.target;

        const contractAddress = "0x620acBC26574BA4e16bc9dd808679Ec627FD29ae";

        const contract = new ethers.Contract(contractAddress, _abi, provider);
        const contractWithUser = contract.connect(user);
        // console.log(contract);

        const buyingPrice = ethers.parseEther("6", 18);

        const buyTx = await contractWithUser.buyDataset(
            "bafkreibra3ilac3sqjoy7mkglbssjd6z6jcp6xl6lbyuxqvxbnse63vh7a",
            { value: buyingPrice }
        );

        await buyTx.wait();
        console.log("Dataset bought successfully");
        
    } catch(error) {
        console.error(error);
    }

}

buyDataset();