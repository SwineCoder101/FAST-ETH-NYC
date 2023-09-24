import express, { Request, Response } from 'express';
import { transfer } from '../service/safe-relay.js';
import { createWallet } from '../service/safe-wallet.js'

const router = express.Router();

// POST /fast/wallet/{Identifier_hash}
router.post('/wallet', async (req: Request, res: Response) => {
    try{
        await createWallet();
        res.status(201).send('Wallet created');
    }catch(e){
        console.log(e);
        res.status(500).send('Wallet creation failed');
    }

});

// GET /fast/wallet/{address}
router.get('/wallet/:address', (req: Request, res: Response) => {
    const address = req.params.adddress;
    // ... your logic here

    res.status(200).send('Wallet details'); // Or send appropriate data
});

// PUT /fast/transfer
router.put('/transfer', async (req: Request, res: Response) => {
    const { asset, quantity, from, to } = req.body;
    
    try{
        await transfer(from, to, quantity, asset);
        res.status(200).send('Transfer successful'); // Or send appropriate data

    }catch(e){
        console.log(e);
        res.status(500).send('Transfer failed'); // Or send appropriate data
    }
});

export { router as walletRouter };
