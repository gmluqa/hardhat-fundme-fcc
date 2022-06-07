// function deployFunc() {
//     console.log("Hi")
// }

const { deployments } = require("hardhat")

// module.exports.default = deployFunc

// Gets those consts from the hre runtime
module.exports = async ({ getNamedAccounts, deployents }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
}
