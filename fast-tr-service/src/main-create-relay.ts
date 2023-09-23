import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types'
import { ethers } from 'ethers'
import { Config } from './config'


const RPC_URL=Config.rpcUrl;
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)


const safeAddress = Config.safeAddress;

// Any address can be used for destination. In this example, we use vitalik.eth
const destinationAddress = '0xE0438Ec42A8dc719B5dd12290793bD7E85510824'
const withdrawAmount = ethers.utils.parseUnits('0.00001', 'ether').toString()

// Create a transaction object
const safeTransactionData: MetaTransactionData = {
    to: destinationAddress,
    data: '0x',
    value: withdrawAmount,
    operation: OperationType.Call
  }

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer
  })
  
  const safeSDK = await Safe.create({
    ethAdapter,
    safeAddress
  })
  
  const relayKit = new GelatoRelayPack()

//   const response = await relayKit.relayTransaction(relayTransaction)
  const relaySafeTransaction = await relayKit.createRelayedTransaction({safe: safeSDK, transactions: [safeTransactionData], options: {
    gasToken: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
  }});

  const signedTransaction = await safeSDK.signTransaction(relaySafeTransaction);

  const {taskId} = await relayKit.executeRelayTransaction(signedTransaction,safeSDK);

  console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${taskId}`);