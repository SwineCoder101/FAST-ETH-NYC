import express, { Request, Response } from 'express';
import { transfer , walletExists} from '../service/safe-relay.js';
import { createWallet } from '../service/safe-wallet.js'

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello from fast tx');
});

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
router.get('/wallet/:address', async (req: Request, res: Response) => {
    const address = req.params.adddress;
    const exists = await walletExists(address);
    if (exists){
        res.status(200).send('Wallet exists'); // Or send appropriate data
    }
    res.status(404).send('Wallet does not exist'); // Or send appropriate data

});

// PUT /fast/transfer
router.put('/transfer', async (req: Request, res: Response) => {
    console.log('req', req);
    console.log('req.body', req.body);
    const { asset, quantity, from, to } = req.body;

    console.log('asset', asset);
    console.log('quantity', quantity);
    console.log('from', from);
    console.log('to', to);
    
    try{
        await transfer(from, to, quantity, asset);
        res.status(200).send('Transfer successful'); // Or send appropriate data
    }catch(e){
        console.log(e);
        res.status(500).send('Transfer failed'); // Or send appropriate data
    }
});

export { router as walletRouter };
