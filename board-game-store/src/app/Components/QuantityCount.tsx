type quantityCountProps = {
    amount: [number, React.Dispatch<React.SetStateAction<number>>],
    min?: number,
    max: number
};

export function QuantityCount({amount: [amt, setAmt], min=1, max}: quantityCountProps) {
    const decrement = () => {
        if (amt > min) setAmt(amt - 1);
    };

    const increment = () => {
        if (amt < max) setAmt(amt + 1);
    };

    return (
        <div className="quantityCount">
        <button onClick={decrement} disabled={amt <= min}>-</button>
        <p>{amt}</p>
        <button onClick={increment} disabled={amt >= max}>+</button>
        </div>
    );
}