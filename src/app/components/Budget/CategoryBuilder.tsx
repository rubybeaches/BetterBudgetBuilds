"use client";
import { useMemo, useState } from "react";
import {
  buildInitialAddList,
  setActiveCategories,
  setInactiveCategoryList,
} from "@/app/lib/helpers";
import { category } from "@/app/lib/types";
import CategorySection from "@/app/components/Budget/CategorySection";
// import { useRouter } from "next/navigation";

const CategoryBuilder = ({
  type,
  expenseCategories,
  baseIncome,
  activeBudgetMonthStart,
  budgetID,
  userID,
}: {
  type: string;
  expenseCategories: category[];
  baseIncome: number;
  activeBudgetMonthStart: number;
  budgetID: number;
  userID: number;
}) => {
  const [income, setIncome] = useState(baseIncome);
  const monthlyIncome = income / 12;

  const [userCategories, setUserCategories] = useState(expenseCategories);

  // starting balance calculation
  const priorBalances = useMemo(() => {
    let essentialTotals = setActiveCategories(
      userCategories,
      "essential"
    ).reduce((sum, cat) => sum + (cat.curr / 100) * monthlyIncome, 0);

    let nonEssentialTotals = setActiveCategories(
      userCategories,
      "non-essential"
    ).reduce((sum, cat) => sum + (cat.curr / 100) * monthlyIncome, 0);

    if (type == "Essentials") {
      return monthlyIncome;
    } else if (type == "Non-Essentials") {
      return monthlyIncome - essentialTotals;
    } else if (type == "Savings") {
      return monthlyIncome - essentialTotals - nonEssentialTotals;
    } else {
      return monthlyIncome;
    }
  }, [userCategories]);

  // handle the ongoing category list states of active category
  const [categoryList, setCategoryList] = useState(
    setActiveCategories(userCategories, type.toLowerCase())
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
      categories={categoryList}
      setCategories={setCategoryList}
      type={type}
      monthlyIncome={monthlyIncome || 0}
      percentTemplate={0.1}
      startingBalance={priorBalances}
      removedCategories={handleAddCategoryList}
      addCategoryList={addCategoryList}
    />
  );
};

export default CategoryBuilder;
