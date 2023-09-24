import { EthersAdapter } from '@safe-global/protocol-kit'
import SafeProtocol from '@safe-global/protocol-kit'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types'
import { ethers } from 'ethers'
import { Config } from '../config.js';
import dotenv from 'dotenv';

// @ts-ignore
const Safe = SafeProtocol.default

export async function walletExists(safeAddress: string){
  const RPC_URL=Config.rpcUrl;
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
  const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
    try{
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer
      })
    
      const safeSDK = await Safe.create({
        ethAdapter,
        safeAddress
      })
  
      const address = await safeSDK.getAddress();
      return address??false;

    }catch(e){
      console.log(e)
      return false;
    }

}

export async function transfer(from: string, to: string, 
amount: string, withdrawType: string = 'ether'){
  const RPC_URL=Config.rpcUrl;
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
  const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
  
  
  const safeAddress = from; 
  // Config.safeAddress;
  
  // Any address can be used for destination. In this example, we use vitalik.eth
    // SAFE : 0xE0438Ec42A8dc719B5dd12290793bD7E85510824
    // SAFE : 0x3AC05161b76a35c1c28dC99Aa01BEd7B24cEA3bf
    // EOA : 0xe7b76A0f3Ee2319795829b3e60268400Af22182b
  const destinationAddress = to
  const withdrawAmount = ethers.utils.parseUnits('0.00001', 'ether').toString()
  
  // Create a transaction object
  const safeTransactionData: MetaTransactionData = {
      to: destinationAddress,
      data: '0x',
      value: withdrawAmount,
      operation: OperationType.Call
    }
  
  console.log("Transaction to Execute:",safeTransactionData )
  
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer
    })
    
  
  
    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress
    })
  
  //   const safeSdk = await Safe.create({
  //     ethAdapter: ethAdapter,
  //     safeAddress: selectedSafe,
  //     isL1SafeMasterCopy: true
  //   })
    
    const relayKit = new GelatoRelayPack()
  
  //   const response = await relayKit.relayTransaction(relayTransaction)
  //   const relaySafeTransaction = await relayKit.createRelayedTransaction({safe: safeSDK, transactions: [safeTransactionData], options: {
  //     gasToken: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
  //   }});
  
    const relaySafeTransaction = await relayKit.createRelayedTransaction({safe: safeSDK, transactions: [safeTransactionData]});
  
    console.log("relaySafeTransaction:",relaySafeTransaction )
    
  
    const signedTransaction = await safeSDK.signTransaction(relaySafeTransaction);
  
    const {taskId} = await relayKit.executeRelayTransaction(signedTransaction,safeSDK);
  
    console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${taskId}`);  
}