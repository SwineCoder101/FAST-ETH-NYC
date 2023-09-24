const serverless = require("serverless-http");
const bodyParser = require('body-parser');
const express = require("express");
var AWS = require('aws-sdk');
const ethers = require('ethers')
var request = require('request');

const app = express();

networks = {
	137: "polygon",
	59140: "linea",
	50: "xdc"
}

const provider = ethers.getDefaultProvider(137)

const mainnet_master_key = process.env.mainnet_master_key

const mainnet_master_wallet = new ethers.Wallet(mainnet_master_key, provider)

const ERC721ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "safeMint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Write a function to take a private key and transfer 0.0001 MATIC to a destination address
const sendMatic = async (privateKey, destinationAddress, amount) => {
    console.log(`Sending ${amount} MATIC from ${(new ethers.Wallet(privateKey)).address} to ${destinationAddress}`)
    const wallet = new ethers.Wallet(privateKey, provider)
    const tx = {
        to: destinationAddress,
        value: ethers.parseEther(amount),
    }
    const sendPromise = await wallet.sendTransaction(tx)
    console.log(`Transaction hash: ${sendPromise}`)
    return sendPromise.hash
}

const mintNFT = async (destinationAddress) => {
    const wallet = new ethers.Wallet(mainnet_master_key, provider)
    const contract = new ethers.Contract("0xe568Aba8FB73f0Fa807026C654E98EC550094281", ERC721ABI, wallet)
    const tx = await contract.safeMint(destinationAddress)
    console.log(`Transaction hash: ${tx.hash}`)
    return tx.hash
}

app.use(bodyParser.json({ strict: false }));

app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Fast Backend running!",
    });
});

app.get("/create_new_address", async (req, res, next) => {
    try {
        const wallet = ethers.Wallet.createRandom()
        let r = await sendMatic(mainnet_master_key, wallet.address, "0.01")
        let r2 = await mintNFT(wallet.address)
        return res.status(200).json({
            "private_key": wallet.privateKey,
            "address": wallet.address,
            "hash": r
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

app.get("/process_transfer", async (req, res, next) => {
    try {
        const wallet = ethers.Wallet.createRandom()
        let r = await sendMatic(req.query.private_key, req.query.destination_wallet_address, "0.001")
		// Check if an address is in the options 

        var options = {
			'method': 'POST',
			'url': 'https://api.airstack.xyz/gql',
			'headers': {
			  'authority': 'api.airstack.xyz',
			  'accept': 'application/json, multipart/mixed',
			  'accept-language': 'en-US,en;q=0.8',
			  'authorization': process.env.AIRSTACK_API_KEY,
			  'content-type': 'application/json',
			  'origin': 'https://app.airstack.xyz',
			  'referer': 'https://app.airstack.xyz/',
			  'sec-ch-ua': '"Brave";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
			  'sec-ch-ua-mobile': '?0',
			  'sec-ch-ua-platform': '"macOS"',
			  'sec-fetch-dest': 'empty',
			  'sec-fetch-mode': 'cors',
			  'sec-fetch-site': 'same-site',
			  'sec-gpc': '1',
			  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
			},
			body: JSON.stringify({
			  query: `query GetNFTBalance {
			Polygon: TokenBalances(
			  input: {filter: {owner: {_eq: ""}, tokenType: {_in: [ERC1155, ERC721]}, tokenAddress: {_eq: "0xe568Aba8FB73f0Fa807026C654E98EC550094281"}}, blockchain: polygon, limit: 50}
			) {
			  TokenBalance {
				tokenId
				chainId
				tokenAddress
				tokenTransfers {
				  id
				}
			  }
			}
		  }`,
			  variables: {}
			})
		  };
		  request(options, function (error, response) {
			y = response.filter(e => e == req.query.destination_wallet_address)[0]
			if (error) throw new Error(error);
			console.log(response.body);
		  });
		return res.status(200).json({
            "hash": r
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

module.exports.handler = serverless(app);
