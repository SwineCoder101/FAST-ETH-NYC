# FAST-ETH-NYC

![alt text](img.png)




F.A.S.T stands for Facial Address State Transfer.

It was inspired by a conversation at the hackathon, where someone remarked that it'd be cool to send money to someone's wallet address by just taking a picture of their face.

We took it on as a challenge, and decided to see if we could build it.

The core problems are quite simple:

Web3 adoption is quite low due to reasonably technical barriers to entry.
Users don't know their own address, and almost definitely don't know someone else's address.
Our hypothesis is that AI will enable super high distribution of web3 in the following ways:

People will have an easier chat interface vs. hard to understand UX
AI will enable better ways to link people to their addresses and bring greater adoption into the Web3 world

Fast Tx Service
To build the repo:

```
yarn install && yarn build
```

To start the server:
```
yarn start
```

To deploy to vercel push/main the latest code to main, the server is deployed to 
http://fast-eth-nyc-v1-b44bddxw3-swinecoder101.vercel.app

API
To get new Safe Wallet for a user
```
GET /fast/wallet
```
To check if a wallet exists
```
GET /fast/wallet/{address}
```
Create a new transfer between users
```
PUT /fast/transfer , body: { 
    "asset":"", 
    "quantity":"0.0001", 
    "from":"0xE0438Ec42A8dc719B5dd12290793bD7E85510824", 
    "to":"0x3AC05161b76a35c1c28dC99Aa01BEd7B24cEA3bf"
}
```

The Safe Gelato 1 Balance is used to fund transactions, the bot currently runs between Goerli/Polygon Mumbai/ Metamask Linea













