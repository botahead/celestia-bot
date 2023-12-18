const Arweave = require('arweave');

// Initialize Arweave
const arweave = Arweave.init({
    host: 'arweave.net', // Hostname or IP address for an Arweave host
    port: 443,           // Port
    protocol: 'https'    // Network protocol http or https
});

// Your wallet key file
const walletKeyFile = require('./arweave-keyfile.json');

// Recipient's address
const recipientAddress = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

// JSON data to be sent
const jsonData = {
    p: "prc-20",
    op: "mint",
    tick: "aris",
    amt: "100"
};

async function sendTransaction() {
    try {
        // Create a transaction
        let transaction = await arweave.createTransaction({
            target: recipientAddress, // Target address
            data: JSON.stringify(jsonData) // JSON data as a string
        }, walletKeyFile);

        // Set Content-Type to application/json
        transaction.addTag('Content-Type', 'application/json');

        // Sign the transaction
        await arweave.transactions.sign(transaction, walletKeyFile);

        // Submit the transaction
        const response = await arweave.transactions.post(transaction);

        console.log("Transaction ID:", transaction.id);
        console.log("Response:", response.status);
    } catch (error) {
        console.error("Error:", error);
    }
}



setInterval(() => {
    console.log('Mint executing')
    // Send the transaction
    sendTransaction().catch(console.error);
}, 1000); // This sets the interval to 1 second
