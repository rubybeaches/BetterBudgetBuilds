
import { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { multiplyPercentToFloat } from "../lib/helpers";

const BudgetInput = ({ income, min, max, current, index, inputSetter }: { income: number, min: number, max: number, index: number, current: number, inputSetter: (min: number, max: number, curr: number, identifier: number) => void }) => {
    const intervalID = useRef<any>();
    const inputRef = useRef<any>();

    useEffect(() => {
        const inputValue = inputRef.current;

        if (inputValue) {
            inputValue.value = multiplyPercentToFloat(current, income) || "0.00";
        }
    }, [current, income])

    const updateInput = (input: number) => {
        const newValue = input || 0;
        const inputValue = inputRef.current;
        if (inputValue) {
            inputValue.value = newValue.toFixed();
        }

        if (intervalID.current) {
            clearTimeout(intervalID.current);
        }

        intervalID.current = setTimeout(() => {
            inputSetter(min, max, newValue / income * 100, index)
        }, 750);
    }

    return (
        <div>
            <span>$</span> <input type="number" ref={inputRef} onChange={(e) => updateInput(e.target.valueAsNumber)} />
        </div>
    )
}

export default BudgetInput;