// function deployFunc() {
//     console.log("Hi")
// }

const { deployments } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

// module.exports.default = deployFunc

// Gets those consts from the hre runtime
module.exports = async ({ getNamedAccounts, deployents }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() //grabs deployer from namedAccounts in hh.cnfg.js
    const chainId = network.config.chainId
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //when going for localhost or hardhat, use mock

    //const fundMe represents deploying of Contract(.sol)
    const fundMe = await deploy("FundMe", {
        from: deployer, // grabs from namedAccounts in hh.cnfg.js
        args: [ethUsdPriceFeedAddress], // put price feed address
        log: true,
    })
    console.log("------------------")
}
module.exports.tags = ["all", "FundMe"]
