import { category } from "@/app/lib/types";
import BudgetInput from "./BudgetInput";
import { useRef } from "react";

const IncomeContainer = ({
  incomeCategory,
  categoryList,
  selectedCategories,
  monthlyIncome,
  index,
  setIncomeCallback,
}: {
  incomeCategory: category;
  categoryList: category[];
  selectedCategories: category[];
  monthlyIncome: number;
  index: number;
  setIncomeCallback: (category: category, identifier: number) => void;
}) => {
  const selectedCategoryRef = useRef<any>();
  const handleInput = (
    min: number,
    max: number,
    curr: number,
    identifier: number
  ) => {
    setIncomeCallback(
      {
        ...incomeCategory,
        category: selectedCategoryRef.current.value,
        min: min,
        max: max,
        curr: curr,
      },
      identifier
    );
  };

  return (
    <div className="incomeContainer">
      <select
        defaultValue={incomeCategory.category}
        ref={selectedCategoryRef}
        onChange={(e) => {
          let included = false;
          selectedCategories.map((cat) => {
            if (cat.category == e.target.value) included = true;
          });
          if (included) {
            alert("Cannot select an item already in use");
            return (e.target.value = incomeCategory.category);
          }
          handleInput(
            incomeCategory.min,
            incomeCategory.max,
            incomeCategory.curr,
            index
          );
        }}
      >
        {categoryList.map((cat, index) => (
          <option key={index} value={cat.category} label={cat.category} />
        ))}
      </select>
      <BudgetInput
        monthlyIncome={monthlyIncome}
        max={incomeCategory.max}
        min={incomeCategory.min}
        current={incomeCategory.curr}
        index={index}
        inputSetter={handleInput}
      />
    </div>
  );
};

export default IncomeContainer;
