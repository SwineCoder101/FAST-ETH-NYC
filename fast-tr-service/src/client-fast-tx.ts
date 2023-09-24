import axios from 'axios';
import readline from 'readline';

const baseURL = 'http://localhost:3000/fast'; // Assuming the server runs on port 3000

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function invokeCreateWallet() {
    try {
        const response = await axios.post(`${baseURL}/wallet`);
        console.log(response.data);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
}

async function invokeGetWallet() {
    const address = await prompt("Enter wallet address: ");
    try {
        const response = await axios.get(`${baseURL}/wallet/${address}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
}

async function invokeTransfer() {
    const asset = await prompt("Enter asset: ");
    const quantity = await prompt("Enter quantity: ");
    const from = await prompt("Enter from address: ");
    const to = await prompt("Enter to address: ");

    try {
        const response = await axios.put(`${baseURL}/transfer`, { asset, quantity, from, to });
        console.log(response.data);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
}

(async () => {
    while (true) {
        console.log("\nOptions:");
        console.log("1. Create Wallet");
        console.log("2. Get Wallet");
        console.log("3. Transfer");
        console.log("4. Exit");

        const choice = await prompt("Enter your choice: ");

        switch (choice) {
            case '1':
                await invokeCreateWallet();
                break;
            case '2':
                await invokeGetWallet();
                break;
            case '3':
                await invokeTransfer();
                break;
            case '4':
                console.log("Goodbye!");
                rl.close();
                process.exit(0);
                break;
            default:
                console.log("Invalid choice, please try again.");
        }
    }
})();
