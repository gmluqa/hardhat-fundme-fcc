const {
    getNamedAccounts,
    getUnnamedAccounts,
    ethers,
    network,
} = require("hardhat")
const { assert } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")
//No mock required since this is for testnet launch

developmentChains.includes(network.name)
    ? describe.skip //is current network hardhat or localhost? if yes skip, if not, do describe function
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async function () {
              deployer = (await getUnnamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
              console.log("in before each loop")
          })

          console.log("out of before each loop")
          it("Allows people to fund and withdraw", async function () {
              let tx = await fundMe.fund({ value: sendValue })
              tx.wait(1)
              tx = await fundMe.cheaperWithdraw({
                  gasLimit: 100000,
              })
              tx.wait(1)
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(endingBalance.toString() + " should equal 0")

              assert.equal(endingBalance.toString(), "0")
          })
      })
