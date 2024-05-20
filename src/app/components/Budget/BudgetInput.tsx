import { useEffect, useRef } from "react";
import { multiplyPercentToFloat, parsetoNum } from "../../lib/helpers";

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
      inputSetter(
        min,
        max,
        (parsetoNum(newValue) / monthlyIncome) * 100,
        index
      );
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexWrap: "nowrap" }}>
      <span>$</span>{" "}
      <input
        type="text"
        ref={inputRef}
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
