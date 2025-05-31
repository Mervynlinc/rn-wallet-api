import express from 'express';
import {getTransaction, 
    createTransaction, 
    summaryTransaction, 
    deleteTransaction} from '../controllers/transactionController.js';

const router = express.Router();
// Route to get all transactions
router.get('/:user_id', getTransaction);
// Route to create a new transaction
router.post('/', createTransaction);
// Route to get summery of all existing transaction
router.get('/summery/:user_id', summaryTransaction);
// Route to delete a transaction
router.delete('/:id', deleteTransaction);

export default router;