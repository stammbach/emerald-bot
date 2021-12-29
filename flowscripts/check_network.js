const fcl = require("@onflow/fcl");
const t = require("@onflow/types");

const checkNetwork = async (guildID) => {
    let result = await fcl.send([
        fcl.script(`
        import EmeraldAuthBot from ${process.env.ADDRESS}

        pub fun main(tenant: Address, guildID: String): String {
            return EmeraldAuthBot.getGuildInfo(tenant, guildID: guildID)!.network
        }
        `),
        fcl.args([
            fcl.arg(process.env.ADDRESS, t.Address),
            fcl.arg(guildID, t.String)
        ])
    ], { node: 'https://access-testnet.onflow.org' }).then(fcl.decode);

    console.log(result);
    return result;
}

module.exports = {
    checkNetwork: checkNetwork
}