import React from "react";
import './quantityInput.css';

interface QuantityInputProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ quantity, onIncrease, onDecrease, onChange }) => {
    return (
        <div className="quantity-input">
            <button className="minus-btn" onClick={(e) => {
                e.preventDefault();
                onDecrease();
            }} disabled={quantity <= 1}>-</button>
            <input
                type="number"
                value={quantity}
                onChange={onChange}
                min="1"
            />
            <button className="plus-btn" onClick={(e) => {
                e.preventDefault();
                onIncrease();
            }}>+</button>
        </div>
    );
};

export default QuantityInput;
