//SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract decMKT is UUPSUpgradeable, OwnableUpgradeable {

    address public contractOwner;

    struct Dataset {
        uint256 id;
        string  datasetName;
        uint256 sellingPrice;
        address seller;
        address owner;
        string  ipfsHash;
        bool    isListed;
    }

    uint256                     public  datasetCount;
    mapping(string => Dataset)  public  datasets;
    string []                   private _ipfsHash;

    function initialize() initializer public {
        contractOwner = msg.sender;
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender);
    }

    function registerDataset (
        string  memory  _datasetName,
        string  memory  datasetHash
    ) public virtual payable {
        // Check if dataset already exists
        require(
            bytes(datasets[datasetHash].ipfsHash).length == 0, 
            "Dataset already exists"
        );
        require(msg.value > 0, "Selling price cannot be zero");
        // If not found
        datasetCount ++;
        datasets[datasetHash] = Dataset(
            datasetCount,
            _datasetName,
            msg.value,
            msg.sender,
            msg.sender,
            datasetHash,
            true
        );

        _ipfsHash.push(datasetHash);
    }

    function getDataset(string memory datasetHash) public view virtual returns(Dataset memory) {
        require(
            bytes(datasets[datasetHash].ipfsHash).length != 0, "Dataset not found");

        return datasets[datasetHash];
    }

    function unlistDataset(string memory datasetHash) public virtual {
        require(datasets[datasetHash].seller == msg.sender || msg.sender == contractOwner, "You are not the seller of this dataset");
        require(bytes(datasets[datasetHash].ipfsHash).length != 0, "Dataset isn't registered");
        require(datasets[datasetHash].isListed == true, "Dataset is already unlisted");

        datasets[datasetHash].isListed = false;
    }

    function relistDataset(string memory datasetHash) public virtual {
        require(datasets[datasetHash].seller == msg.sender || msg.sender == contractOwner, "You are not the seller of this dataset");
        require(bytes(datasets[datasetHash].ipfsHash).length != 0, "Dataset isn't registered");
        require(datasets[datasetHash].isListed == false, "Dataset is already listed");

        datasets[datasetHash].isListed = true;
    }

    function updateSellingPrice(uint256 _updatedSellingPrice, string memory datasetHash) public virtual {
        require(datasets[datasetHash].seller == msg.sender || msg.sender == contractOwner, "You are not the seller of this dataset");
        require(_updatedSellingPrice > 0, "Selling price cannot be 0");
        require(bytes(datasets[datasetHash].ipfsHash).length != 0, "Dataset isn't registered");

        datasets[datasetHash].sellingPrice = _updatedSellingPrice;
    }

    function buyDataset(string memory datasetHash) public payable virtual {
        require(msg.value >= datasets[datasetHash].sellingPrice, "Please enter valid buying price");
        require(datasets[datasetHash].isListed == true, "Dataset is not listed");

        datasets[datasetHash].seller = msg.sender;
        datasets[datasetHash].isListed = false;

        payable(datasets[datasetHash].owner).transfer(msg.value);
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override onlyOwner {}

}