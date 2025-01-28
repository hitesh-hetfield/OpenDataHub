const { uploadAndRegister } = require("./uploadAndRegister.js");
const hre = require("hardhat");

(async () => {

        const filePath = "D:/Data Science/dataframe.csv";
        const fileName = "Sample Dataset 2";
        const sellingPrice = hre.ethers.parseEther("5", 18);

        const result = await uploadAndRegister(filePath, fileName, sellingPrice);

    }
)();