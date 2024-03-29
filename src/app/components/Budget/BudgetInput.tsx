
import { useEffect, useRef } from "react";
import { multiplyPercentToFloat } from "../../lib/helpers";

const BudgetInput = ({ monthlyIncome, min, max, current, index, inputSetter }: { monthlyIncome: number, min: number, max: number, index: number, current: number, inputSetter: (min: number, max: number, curr: number, identifier: number) => void }) => {
    const intervalID = useRef<any>();
    const inputRef = useRef<any>();

    useEffect(() => {
        const inputValue = inputRef.current;

        if (inputValue) {
            inputValue.value = multiplyPercentToFloat(current, monthlyIncome) || "0.00";
        }
    }, [current, monthlyIncome])

    const updateInput = (input: number) => {
        const newValue = input || 0;
        const inputValue = inputRef.current;
        if (inputValue) {
            inputValue.value = newValue;
        }

        if (intervalID.current) {
            clearTimeout(intervalID.current);
        }

        intervalID.current = setTimeout(() => {
            inputSetter(min, max, newValue / monthlyIncome * 100, index)
        }, 1000);
    }

    return (
        <div>
            <span>$</span> <input type="number" ref={inputRef} onChange={(e) => updateInput(e.target.valueAsNumber)} onKeyDown={(e) => {
                if (e.key == 'Backspace') {
                    e.preventDefault();
                    updateInput(0);
                }
            }} />
        </div>
    )
}

export default BudgetInput;