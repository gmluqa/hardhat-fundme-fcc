const { run } = require("hardhat")

// Utils folder for running scripts

// verify() imported from last lesson
async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    //runs yarn run hardhat args, always do verify in try-catch because etherscan caches verify functions
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }
