const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("decMKT Contract", function () {
    let contract, deployer, buyer;
    const msgValue = ethers.parseEther("10", 18);

    beforeEach(async function () {
        const DecMKT = await ethers.getContractFactory("decMKT");
        contract = await DecMKT.deploy();
        await contract.waitForDeployment();
        [deployer, buyer] = await ethers.getSigners();
    });

    it("should register a dataset", async function () {
        
        const tx = await contract.registerDataset(
            "Test Dataset", 
            "QmExampleHash", 
            { value: msgValue }
        );
        
        await tx.wait();

        const dataset = await contract.datasets("QmExampleHash");
        
        expect(dataset.id).to.equal(1);
        expect(dataset.datasetName).to.equal("Test Dataset");
        expect(dataset.sellingPrice).to.equal(msgValue);
        expect(dataset.seller).to.equal(deployer.address);
        expect(dataset.owner).to.equal(deployer.address);
        expect(dataset.ipfsHash).to.equal("QmExampleHash");
        expect(dataset.isListed).to.be.true;
    });

    it("should not allow duplicate datasets", async function () {
        const tx = await contract.registerDataset(
            "Test Dataset", 
            "QmExampleHash",
            {value: msgValue}
        );
        await tx.wait();

        await expect(
            contract.registerDataset("Another Dataset", "QmExampleHash")
        ).to.be.revertedWith("Dataset already exists");
    });

    it("should return a dataset", async function () {
        const tx = await contract.registerDataset(
            "Test Dataset", 
            "QmExampleHash",
            { value: msgValue }
        );
        
        await tx.wait();
        const dataset = await contract.getDataset("QmExampleHash");
        
        expect(dataset.id).to.equal(1);
        expect(dataset.datasetName).to.equal("Test Dataset");
        expect(dataset.sellingPrice).to.equal(msgValue);
        expect(dataset.seller).to.equal(deployer.address);
        expect(dataset.owner).to.equal(deployer.address);
        expect(dataset.ipfsHash).to.equal("QmExampleHash");
        expect(dataset.isListed).to.be.true;

    });

    it("should sell the dataset", async function () {
        const buyPrice = ethers.parseEther("20", 18);
        const tx = await contract.registerDataset(
            "Test Dataset", 
            "QmExampleHash",
            { value: msgValue }
        );
        await tx.wait();

        const buyTx = await contract
        .connect(buyer)
        .buyDataset("QmExampleHash",{ value: buyPrice });
        await buyTx.wait();
        
        const dataset = await contract.datasets("QmExampleHash");

        expect(dataset.id).to.equal(1);
        expect(dataset.datasetName).to.equal("Test Dataset");
        expect(dataset.sellingPrice).to.equal(msgValue);
        expect(dataset.seller).to.equal(buyer.address);
        expect(dataset.owner).to.equal(deployer.address);
        expect(dataset.ipfsHash).to.equal("QmExampleHash");
        expect(dataset.isListed).to.be.false;
    })

});
