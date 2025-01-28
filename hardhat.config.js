require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

account_pvt_key = [process.env.PVT_KEY]

module.exports = {
  solidity: "0.8.22",
  networks: {
    thunder: {
      url: "https://rpc.testnet.5ire.network",
      chainId: 997,
      accounts: account_pvt_key
    },
    qa: {
      url: "https://rpc.qa.5ire.network",
      chainId: 997995,
      accounts: account_pvt_key
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts: account_pvt_key
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337
    }
  },
  etherscan: {
    apiKey: {
      thunder: process.env.THUNDER_API_KEY !== undefined ? [process.env.THUNDER_API_KEY] : [],
      qa: process.env.THUNDER_API_KEY !== undefined ? [process.env.THUNDER_API_KEY] : [],
      amoy: process.env.POLYGON_API_KEY !== undefined ? [process.env.POLYGON_API_KEY] : [],
    },
    customChains: [
      {
        network: "thunder",
        chainId: 997,
        urls: {
          apiURL: "https://contract.evm.testnet.5ire.network/5ire/verify",
          browserURL: "https://testnet.5irescan.io/dashboard"
        }
      },
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com/"
        }
      },
      {
        network: "qa",
        chainId: 997995,
        urls: {
          apiURL: "https://contract.evm.qa.5ire.network/5ire/verify",
          browserURL: "https://scan.qa.5ire.network",
        },
      }
    ]
  }
};

