
import { useEffect, useRef, useState } from "react";
import { multiplyPercentToFloat } from "../lib/helpers";

const BudgetInput = ({ income, min, max, current, index, inputSetter }: { income: number, min: number, max: number, index: number, current: number, inputSetter: (min: number, max: number, curr: number, identifier: number) => void }) => {
    const currentFloat = multiplyPercentToFloat(current, income) || 0;
    const intervalID = useRef<any>();
    const [inputValue, setInputValue] = useState(0);

    useEffect(() => {
        if (toggle) {
            counter = setInterval(() => setTimer(timer => timer + 1), 1000);
        }
        return () => {
            clearInterval(counter);
        };
    }, [toggle]);

    const updateInput = (input: number) => {

        setInputValue(() => input);

        if (intervalID.current) {
            clearTimeout(intervalID.current);
        }

        intervalID.current = setTimeout(() => {
            inputSetter(min, max, input / income * 100, index)
        }, 500);
    }

    return (
        <div>
            <span>$</span> <input type="number" defaultValue={inputValue} onChange={(e) => updateInput(e.target.valueAsNumber)} />
        </div>
    )
}

export default BudgetInput;