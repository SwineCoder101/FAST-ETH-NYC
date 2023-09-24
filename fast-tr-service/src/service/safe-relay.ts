import { EthersAdapter } from '@safe-global/protocol-kit'
import SafeProtocol from '@safe-global/protocol-kit'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types'
import { ethers } from 'ethers'
import { Config } from '../config.js';

// @ts-ignore
const Safe = SafeProtocol.default

export async function transfer(from: string, to: string, amount: string, withdrawType: string = 'ether'){

const RPC_URL=Config.rpcUrl;
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)


const withdrawAmount = ethers.utils.parseUnits(amount, withdrawType).toString()

const safeTransactionData: MetaTransactionData = {
    to,
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
    from
  })
  
  const relayKit = new GelatoRelayPack()

  const relaySafeTransaction = await relayKit.createRelayedTransaction({safe: safeSDK, transactions: [safeTransactionData]});

  console.log("relaySafeTransaction:",relaySafeTransaction )
  

  const signedTransaction = await safeSDK.signTransaction(relaySafeTransaction);

  const {taskId} = await relayKit.executeRelayTransaction(signedTransaction,safeSDK);

  console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${taskId}`);
}