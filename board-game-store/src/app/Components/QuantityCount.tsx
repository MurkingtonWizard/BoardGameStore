type quantityCountProps = {
    amount: [number, React.Dispatch<React.SetStateAction<number>>],
    max: number
};

export function QuantityCount({amount: [amt, setAmt], max}: quantityCountProps) {
    const decrement = () => {
        if (amt > 1) setAmt(amt - 1);
    };

    const increment = () => {
        if (amt < max) setAmt(amt + 1);
    };

    return (
        <div className="quantityCount">
        <button onClick={decrement} disabled={amt <= 1}>-</button>
        <p>{amt}</p>
        <button onClick={increment} disabled={amt >= max}>+</button>
        </div>
    );
}