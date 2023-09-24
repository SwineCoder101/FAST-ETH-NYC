import express from 'express';
import { walletRouter } from './routes/wallet.js';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
// app.use(express.json());
app.use(bodyParser.json());

// Mount the router on the app
app.use('/fast', walletRouter);
// app.use(walletRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
