import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
import { SafeFactory } from '@safe-global/protocol-kit'
import { SafeAccountConfig } from '@safe-global/protocol-kit'
import dotenv from 'dotenv'
import { Config } from '../config.js';


// your Safe address: 0xE0438Ec42A8dc719B5dd12290793bD7E85510824



export async function createWallet () : Promise<string>{


dotenv.config()

const txServiceUrl = 'https://safe-transaction-goerli.safe.global'

// https://chainlist.org/?search=goerli&testnets=true
const RPC_URL= 'https://eth-goerli.g.alchemy.com/v2/OwAquhwuVt8yeWAqv6tbR6M_8KeU2yF1'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)



// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)

console.log('RPC_URL', RPC_URL);
console.log('txServiceUrl', txServiceUrl);


const ethAdapterOwner1 = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer
})

// const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 })

const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })


const safeAccountConfig: SafeAccountConfig = {
  owners: [
    await owner1Signer.getAddress(),
  ],
  threshold: 1,
  // ... (Optional params)
}

const saltNonce: string =  new Date().getTime().toString();

const predictedSafeAddress = await safeFactory.predictSafeAddress(safeAccountConfig, saltNonce)

console.log('predictedSafeAddress: ', predictedSafeAddress)

/* This Safe is tied to owner 1 because the factory was initialized with
an adapter that had owner 1 as the signer. */
const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig, saltNonce })

const safeAddress = await safeSdkOwner1.getAddress()

console.log('Your Safe has been deployed:')
console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
console.log(`https://app.safe.global/gor:${safeAddress}`)

return safeAddress || '0x0' as string;
}