// unit tests are for specific parts of code, units

//Imports the deployments module
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    beforeEach(async function () {
        // const accounts = await ethers.getSigners() // returns accounts signing
        deployer = (await getNamedAccounts()).deployer // gets deployer address
        await deployments.fixture(["all"]) //runs through all scripts with all tag
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("Sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
})
