import { useEffect, useRef } from "react";
import {
  convertToFloat,
  multiplyPercentToFloat,
  parsetoNum,
} from "../../lib/helpers";
import { useSave } from "@/app/lib/useSave";

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

  const updateInput = () => {
    const inputValue = inputRef.current;
    if (!inputRef) return;

    const numValue = parsetoNum(inputValue.value);
    const sameValueCheck =
      ((current * monthlyIncome) / 100).toFixed(2) == numValue.toFixed(2);
    if (sameValueCheck) inputValue.value = convertToFloat(numValue);
    inputSetter(min, max, (numValue / monthlyIncome) * 100, index);
  };

  const debounceSave = useSave(updateInput, 1000);

  return (
    <div style={{ display: "flex", flexWrap: "nowrap" }}>
      <span>$</span>{" "}
      <input
        type="text"
        ref={inputRef}
        defaultValue={multiplyPercentToFloat(current, monthlyIncome) || "0.00"}
        {...debounceSave}
        onKeyDown={(e) => {
          if (e.key == "Backspace") {
            e.preventDefault();
            inputRef.current.value = "";
          }
        }}
      />
    </div>
  );
};

export default BudgetInput;
