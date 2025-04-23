"use client";
import { useMemo, useState } from "react";
import {
  buildInitialAddList,
  setActiveCategories,
  setInactiveCategoryList,
} from "../../../lib/helpers";
import { category } from "../../../lib/types";
import CategorySection from "@/app/components/Budget/CategorySection";
// import { useRouter } from "next/navigation";

const NonEssentialCategoryBuilder = ({
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

  // for calculations
  const essentialTotal = useMemo(() => {
    return setActiveCategories(userCategories, "essential").reduce(
      (sum, cat) => sum + (cat.curr / 100) * monthlyIncome,
      0
    );
  }, [userCategories]);

  // handle the ongoing category list states of essentials
  const [nonEssentialCategories, setNonEssentialCategories] = useState(
    setActiveCategories(userCategories, "non-essential")
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
      categories={nonEssentialCategories}
      setCategories={setNonEssentialCategories}
      type="Non-Essentials"
      monthlyIncome={monthlyIncome || 0}
      percentTemplate={0.3}
      startingBalance={monthlyIncome - essentialTotal}
      removedCategories={handleAddCategoryList}
      addCategoryList={addCategoryList}
    />
  );
};

export default NonEssentialCategoryBuilder;
