const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployents }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() //grabs deployer from namedAccounts in hh.cnfg.js
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        console.log("Local network detected, deploying mocks")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER], //constructor params for mock v3 agg, see source file .sol
        })
        console.log("Mocks deployed!")
        console.log("------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
// allows for `yarn hardhat deploy --tags tag` # only runs scripts with tag
