require("@nomiclabs/hardhat-waffle")

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/us2kR_16L9IeigMzLViBwSqcq_8NyPdH",
      accounts: ['1d7ae18bec8d9f0f82b90daf59a1460cc6be5828b4037fe868cd60b71a8f4082']
    }
  }
}
