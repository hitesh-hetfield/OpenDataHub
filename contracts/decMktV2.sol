// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./decMkt.sol";

contract decMKTV2 is decMKT {

    uint256 private  _registrationPercent;
    uint256 private  _sellingPercent;

    function initializeV2() reinitializer(2) public {
        _registrationPercent = 10; // in percentage
        _sellingPercent      = 10; // in percentage
    }

    // everytime someone registers a dataset the user pays a registration fee    

    function registerDatasetV2 (
        string  memory  _datasetName,
        string  memory  datasetHash,
        uint256         _sellingPrice
    ) public virtual {
        require(
            bytes(datasets[datasetHash].ipfsHash).length == 0, 
            "Dataset already exists"
        );
        require(_sellingPrice > 0, "Selling price cannot be zero");
        // If not found

        uint256 registrationFee = _sellingPrice / _registrationPercent;
        _sellingPrice -= registrationFee;

        datasetCount ++;
        datasets[datasetHash] = Dataset(
            datasetCount,
            _datasetName,
            _sellingPrice,
            msg.sender,
            msg.sender,
            datasetHash,
            true
        );
    }

    function buyDataset(string memory datasetHash) public payable virtual override{
        
        require(msg.value >= datasets[datasetHash].sellingPrice, "Please enter valid buying price");
        require(datasets[datasetHash].isListed == true, "Dataset is not listed");

        uint256 sellingFee = msg.value / _sellingPercent;
        uint256 sellingPrice = msg.value - sellingFee;

        datasets[datasetHash].seller = msg.sender;
        datasets[datasetHash].isListed = false;
        datasets[datasetHash].sellingPrice = sellingPrice;

        payable(datasets[datasetHash].owner).transfer(sellingPrice);
    }

    function getRegistrationPercentage() public view virtual returns(uint256) {
        return _registrationPercent;
    }

    function getSellingPercentage() public view virtual returns(uint256) {
        return _sellingPercent;
    }

    function updateRegistrationPercentage(uint256 updatedRegistrationPercentage) public virtual onlyOwner {
        require(updatedRegistrationPercentage <= 1, "Invalid percentage entered");
        _registrationPercent = updatedRegistrationPercentage;
    }
    
    function updateSellingPercentage(uint256 updatedSellingPercentage) public virtual onlyOwner {
        require(updatedSellingPercentage <= 1, "Invalid percentage entered");
        _sellingPercent = updatedSellingPercentage;
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {}

}