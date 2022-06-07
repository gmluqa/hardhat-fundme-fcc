// function deployFunc() {
//     console.log("Hi")
// }

const { deployments } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

// module.exports.default = deployFunc

// Gets those consts from the hre runtime
module.exports = async ({ getNamedAccounts, deployents }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() //grabs deployer from namedAccounts in hh.cnfg.js
    const chainId = network.config.chainId
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress
    // .includes scans and array for (), returns true if found
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //when going for localhost or hardhat, use mock

    //const fundMe represents deploying of Contract(.sol)
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer, // grabs from namedAccounts in hh.cnfg.js
        args: [ethUsdPriceFeedAddress], // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1, //grabs from hhconfig, if none, wait 1
    })

    console.log("------------------")

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
}
module.exports.tags = ["all", "FundMe"]
