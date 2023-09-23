import dotenv from 'dotenv'

dotenv.config()

export const Config = {
  port: parseInt(process.env.PORT || '8080'),
  rpcUrl: process.env.RPC_ALCHEMY_URL_GOERLI || 'https://eth-goerli.public.blastapi.io',
  txServiceUrl: process.env.TX_SERVICE_URL || 'https://safe-transaction-goerli.safe.global',
  safeAddress: process.env.SAFE_ADDRESS || '0x859d7afc3C63f6B3F5612202f9eB1833366E4610',
  owner1PrivateKey: process.env.OWNER_1_PRIVATE_KEY,
  gelatoRelayApiKey: process.env.GELATO_RELAY_API_KEY
}
