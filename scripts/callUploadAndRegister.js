const { uploadAndRegister } = require("./uploadAndRegister.js");
const hre = require("hardhat");

(async () => {

        const filePath = "D:/Data Science/PROJECTS/Statistical Analysis Using Python/scores.csv";
        const fileName = "Scores";
        const sellingPrice = hre.ethers.parseEther("5", 18);

        const result = await uploadAndRegister(filePath, fileName, sellingPrice);

    }
)();