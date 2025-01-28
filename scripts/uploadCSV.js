const { uploadCSV } = require("./testPinata.js");

(async () => {
    
    const filePath = "D:/Data Science/dataframe.csv";
    const fileName = "Sample Dataset";

    const testHash = await uploadCSV(filePath, fileName);
    console.log(testHash);
})
();