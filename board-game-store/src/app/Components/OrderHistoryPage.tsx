import { CreateReturn, GetOrderHistory } from "@/Controllers/TransactionController";
import { ITransaction, ITransactionItem } from "@/model";
import { useEffect, useState } from "react";
import { QuantityCount } from "./QuantityCount";
import { RefreshProp } from "./PageWrapper";

export function OrderHistoryPage(props: any) {
    const [refresh, setRefresh] = useState(0);
    const [orders, setOrders] = useState<ITransaction[]>([])

    const onRefresh = () => {
        setRefresh(refresh === 1 ? 0 : 1)
    }

    const FetchOrders = async () => {
        const result = await GetOrderHistory();
        console.log(result)
        setOrders(result === false ? [] : result);
    }

    useEffect(() => {
        FetchOrders();
    }, [refresh]);

    return (
        <main className="pt-24 p-8">
            <div className="page-col">
                <div className="page-row" style={{justifyContent:"left"}}>
                    <h1 className="text-3xl font-bold">Order History</h1>
                </div>
                { orders.length === 0 ?
                    <p>No Orders</p>
                    :
                    <div className="page-col" style={{gap: "0.5rem"}}>
                        {orders.map((transaction, index) => (
                            <Order key={index} transaction={transaction} onRefresh={onRefresh}/>
                        ))}
                    </div>
                    
                }
            </div>
        </main>
    );
}

function Order({ transaction, onRefresh } : {transaction: ITransaction}&RefreshProp) {
    const ReturnAll = async () => {
        const transactions = transaction.items.map(item => ({
            boardGameID: item.id,
            transaction_id: transaction.id,
            quantity: item.quantity - item.returned_quantity
        }));
        await CreateReturn(transactions);
        onRefresh();
    }

    const canReturnAll = transaction.items
        .map(item => item.quantity - item.returned_quantity)
        .reduce((acc, val) => acc + val, 0) !== 0;

    return (
        <div className="page-row bg-white shadow-sm rounded-xl p-5 space-y-1" style={{gap: "1em", width: "60vw", justifyContent: "space-between"}}>
            <div className="page-col" style={{justifyContent: "center"}}>
                <span style={{textAlign: "center" }}>
                    {new Date(transaction.date_time).toLocaleString()}
                </span>
                <span style={{textAlign: "center", fontWeight: "600" }}>
                    ${(transaction.total).toFixed(2)}
                </span>
                <button disabled={!canReturnAll} type="button" onClick={ReturnAll} className="return-button"style={{margin: "0", }}>Return All</button>
            </div>
            <div className="page-col" style={{width: "100%"}}>
                {transaction.items.map((item, index) => (
                    <OrderItem key={index} transactionID={transaction.id} item={item} onRefresh={onRefresh}/>
                ))}

            </div>
        </div>
    );
}

function OrderItem({ transactionID, item, onRefresh } : {transactionID: number, item: ITransactionItem}&RefreshProp) {
    const [quantity, setQuantity] = useState(0);

    const ReturnItem = async () => {
        const transaction = [{boardGameID: item.id, transaction_id: transactionID, quantity: quantity }]
        await CreateReturn(transaction);
        onRefresh();
    }

    return (
        <div className="page-row" style={{width:"100%", border: "1px solid #ccc", 
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"}}>
            <span style={{ width: "25%" }}>
                {item.name}
            </span>
            <span style={{ width: "20%", textAlign: "center" }}>
                Bought: {item.quantity} Returned:{item.returned_quantity}
            </span>
            <QuantityCount amount={[quantity, setQuantity]} min={0} max={item.quantity-item.returned_quantity}/>
            <span style={{ width: "20%", textAlign: "center" }}>
                ${(quantity * item.price).toFixed(2)}
            </span>
            <button disabled={quantity===0} type="button" onClick={ReturnItem} className="return-button" style={{margin: "0", }}>
                Return
            </button>
        </div>
    );
}