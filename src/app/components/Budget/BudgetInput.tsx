import { useEffect, useRef } from "react";
import {
  convertToFloat,
  multiplyPercentToFloat,
  parsetoNum,
} from "../../lib/helpers";

const BudgetInput = ({
  monthlyIncome,
  min,
  max,
  current,
  index,
  inputSetter,
}: {
  monthlyIncome: number;
  min: number;
  max: number;
  index: number;
  current: number;
  inputSetter: (
    min: number,
    max: number,
    curr: number,
    identifier: number
  ) => void;
}) => {
  const intervalID = useRef<any>();
  const inputRef = useRef<any>();

  useEffect(() => {
    const inputValue = inputRef.current;

    if (inputValue) {
      inputValue.value =
        multiplyPercentToFloat(current, monthlyIncome) || "0.00";
    }
  }, [current, monthlyIncome]);

  const updateInput = (input: string) => {
    const newValue = input || "";
    const inputValue = inputRef.current;
    if (inputValue) {
      inputValue.value = newValue;
    }

    if (intervalID.current) {
      clearTimeout(intervalID.current);
    }

    intervalID.current = setTimeout(() => {
      const numValue = parsetoNum(newValue);
      const sameValueCheck =
        ((current * monthlyIncome) / 100).toFixed(2) == numValue.toFixed(2);
      if (sameValueCheck) inputValue.value = convertToFloat(numValue);
      inputSetter(min, max, (numValue / monthlyIncome) * 100, index);
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexWrap: "nowrap" }}>
      <span>$</span>{" "}
      <input
        type="text"
        ref={inputRef}
        defaultValue={multiplyPercentToFloat(current, monthlyIncome) || "0.00"}
        onChange={(e) => updateInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Backspace") {
            e.preventDefault();
            updateInput("");
          }
          if (e.key == "Enter") {
            e.preventDefault();
            const inputValue = inputRef.current;
            if (inputValue) {
              inputSetter(
                min,
                max,
                (parsetoNum(inputValue.value) / monthlyIncome) * 100,
                index
              );
            }
          }
        }}
      />
    </div>
  );
};

export default BudgetInput;
