"use client";
import { useMemo, useRef, useState } from "react";
import {
  buildHelpCategories,
  buildInitialAddList,
  convertToFloat,
  parsetoNum,
  setActiveCategories,
  setInactiveCategoryList,
  sortCategories,
} from "../../../lib/helpers";
import { category } from "../../../lib/types";
import IncomeContainer from "../../../components/Budget/IncomeContainer";
import CategorySection from "@/app/components/Budget/CategorySection";
// import { useRouter } from "next/navigation";

const EssentialCategoryBuilder = ({
  expenseCategories,
  baseIncome,
  activeBudgetMonthStart,
  budgetID,
  userID,
}: {
  expenseCategories: category[];
  baseIncome: number;
  activeBudgetMonthStart: number;
  budgetID: number;
  userID: number;
}) => {
  const [income, setIncome] = useState(baseIncome);
  const monthlyIncome = income / 12;

  const [userCategories, setUserCategories] = useState(expenseCategories);

  // handle the ongoing category list states of essentials
  const [essentialCategories, setEssentialCategories] = useState(
    setActiveCategories(userCategories, "essential")
  );

  // handle ongoing state of categories removed by user
  const [addCategoryList, setAddCategoryList] = useState(
    buildInitialAddList(userCategories)
  );

  const [inactiveCategories, setInactiveCategories] = useState(
    setInactiveCategoryList(userCategories)
  );

  const handleAddCategoryList = (removedValue: category) => {
    if (removedValue.active) {
      const filterArray = addCategoryList.filter(
        (cat) => cat.category != removedValue.category
      );
      setAddCategoryList(() => filterArray);
      setInactiveCategories(() => {
        const inactive = inactiveCategories.filter(
          (cat) => cat.category != removedValue.category
        );
        return inactive;
      });
    } else {
      const addArray = [...addCategoryList];
      addArray.push(removedValue);
      setAddCategoryList(() => addArray);
      setInactiveCategories(() => {
        const inactive = [...inactiveCategories];
        inactive.push({ ...removedValue, active: 0 });
        return inactive;
      });
    }
  };

  return (
    <CategorySection
      categories={essentialCategories}
      setCategories={setEssentialCategories}
      type="Essentials"
      monthlyIncome={monthlyIncome || 0}
      percentTemplate={0.6}
      startingBalance={monthlyIncome}
      removedCategories={handleAddCategoryList}
      addCategoryList={addCategoryList}
    />
  );
};

export default EssentialCategoryBuilder;
