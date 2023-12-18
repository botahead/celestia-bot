const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { SigningStargateClient, GasPrice, calculateFee } = require("@cosmjs/stargate");
require('dotenv').config();

async function sendCosmosTokens() {
    const mnemonic = process.env.SEED_PHRASE;
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'celestia' });
    const [firstAccount] = await wallet.getAccounts();

    const rpcEndpoint = "http://rpc.lunaroasis.net";
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);

    const transactionAmount = 1
    const defaultGasPrice = GasPrice.fromString('160utia')
    const defaultSendFee = calculateFee(80_000, defaultGasPrice)
    const recipient = process.env.WALLET_ADDRESS;

    // console.log('sender', firstAccount.address)
    // console.log('transactionFee', defaultSendFee)
    // console.log('amount', transactionAmount)

    // Send a transaction
    const transaction = await client.sendTokens(
        firstAccount.address,
        recipient,
        [{ denom: "utia", amount: "1" }],
        {
            amount: [{ denom: "utia", amount: "1915" }],
            gas: "100000",
        },
        "ZGF0YToseyJvcCI6Im1pbnQiLCJhbXQiOjEwMDAwLCJ0aWNrIjoiY2lhcyIsInAiOiJjaWEtMjAifQ=="
    );

    console.log('Successfully broadcasted:', transaction.transactionHash)
}

sendCosmosTokens().catch(err => {
    console.error(err);
});

setInterval(() => {
    console.log('Mint executing')
    sendCosmosTokens().catch(err => {
        console.error(err);
    });
}, 1000); // This sets the interval to 1 second