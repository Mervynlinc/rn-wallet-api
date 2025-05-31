import {sql} from "../config/db.js";

export async function getTransaction(req, res) {
    try {
            const user_id = req.params.user_id;
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${user_id}
            ORDER BY created_at DESC;
        `
        console.log(transactions);
        res.status(200).json(transactions);
        } catch (error) {
            console.error("Error fetching transaction:", error);
            res.status(500).json({ error: "Internal server error" });
        }  
}
export async function createTransaction(req, res) {
    try {
            const { user_id, title, amount, category } =  req.body;
            const transactions = await sql`
                INSERT INTO transactions (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING *;
            `;
            if (!user_id || !title  || amount === undefined || !category){
                return res.status(400).json({ error: "All fields are required" });
            }
            res.status(201).json(transactions[0]);
        } catch (error) {
            console.error("Error creating transaction:", error);
            res.status(500).json({ error: "Internal server error" });
        }
}
export async function summaryTransaction(req, res) {
    try {
        const user_id = req.params.user_id;
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance from transactions WHERE user_id = ${user_id}
        `;

         const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expense from transactions WHERE user_id = ${user_id} AND amount < 0
        `;

         const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income from transactions WHERE user_id = ${user_id} AND amount > 0
        `;
        res.status(200).json({
            balance: balanceResult[0].balance,
            expense: expenseResult[0].expense,
            income: incomeResult[0].income
        }
            
        );
    } catch (error) {
        console.error("Error fetching transaction summary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export async function deleteTransaction(req, res) {
    try {
            const id = req.params.id;
            const result = await sql`
            DELETE FROM transactions WHERE id = ${id}
            RETURNING *;
            `;
            if (result.length === 0) {
                return res.status(404).json({ error: "Transaction not found" });
            }
            res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });
        } catch (error) {
            console.error("Error deleting transaction:", error);
            res.status(500).json({ error: "Internal server error" });
        }
}