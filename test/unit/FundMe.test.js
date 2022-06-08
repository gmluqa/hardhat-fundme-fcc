// unit tests are for specific parts of code, units

//Imports the deployments module
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") // does 10 ** 18 with any number
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
            const response = await fundMe.s_priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.reverted //expect uses waffle, expect .to.be.reverted specific err code
        })
        it("Updates the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.s_addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders ", async function () {
            await fundMe.fund({ value: sendValue }) // fills with key value pair
            const funder = await fundMe.s_funders(0) //function in FundMe.sol
            assert.equal(funder, deployer)
        })
    })
    describe("Withdraw", async function () {
        beforeEach(async function () {
            //in describe scope
            await fundMe.fund({ value: sendValue }) // funds with sendValue const
        })

        it("Withdraws ETH from a single founder", async function () {
            // Arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address // get balance of contract from same creator
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer // get balance of contract from deployer
            )
            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, effectiveGasPrice } = transactionReceipt //pulls objects out of = object
            const gasCost = gasUsed.mul(effectiveGasPrice) // .(mul) used to multiply BIGnumbers

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            // Assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingDeployerBalance.add(startingFundMeBalance).toString(), // .add() is a solidity function
                endingDeployerBalance.add(gasCost).toString()
            )
        })
    })
})
