"use client";
import "./page.css";
import { useMemo, useRef, useState } from "react";
import CategorySection from "../../../components/Budget/CategorySection";
import {
  allMonths,
  buildInitialAddList,
  convertToFloat,
  parsetoNum,
  setActiveCategories,
  setInactiveCategoryList,
  sortCategories,
} from "../../../lib/helpers";
import { category } from "../../../lib/types";
import IncomeContainer from "../../../components/Budget/IncomeContainer";
import SuccessPopUp from "../../../components/SuccessPopUp";
import {
  createBudget,
  updateActiveBudget,
  updateAndCreateBudget,
} from "../../../lib/actions";
import { useRouter } from "next/navigation";

const incomeCategoryBuilder = ({
  expenseCategories,
  incomeCategories,
  baseIncome,
  activeBudgetMonthStart,
  budgetID,
  userID,
}: {
  expenseCategories: category[];
  incomeCategories: category[];
  baseIncome: number;
  activeBudgetMonthStart: number;
  budgetID: number;
  userID: number;
}) => {
  const [userCategories, setUserCategories] = useState(expenseCategories);
  const [userIncomeCategories, setUserIncomeCategories] = useState(
    setActiveCategories(incomeCategories, "income")
  );
  const [income, setIncome] = useState(baseIncome);
  const incomeCategoryList = useMemo(
    () =>
      sortCategories(
        [...incomeCategories, ...buildInitialAddList(incomeCategories)].filter(
          (filter) => {
            let include = true;
            userIncomeCategories.map((cat) => {
              if (filter.category == cat.category) include = false;
            });
            if (include) return filter;
          }
        ),
        "category"
      ),
    [userIncomeCategories]
  );

  const [displaySaved, setDisplaySaved] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    Math.max(activeBudgetMonthStart, new Date().getMonth())
  );
  const selectedMonthLong = new Date(
    `${new Date().getFullYear()}-${selectedMonth + 1}`
  ).toLocaleString("en-US", { month: "long" });

  const successTimer = useRef<any>();
  const router = useRouter();
  const intervalID = useRef<any>();
  const incomeRef = useRef<any>();
  const saveMonthRef = useRef<any>();
  const monthlyIncome = income / 12;
  const incomeSectionBalance =
    monthlyIncome -
    userIncomeCategories.reduce(
      (sum, cat) => (cat.curr * monthlyIncome) / 100 + sum,
      0
    );

  const updateIncome = (input: string) => {
    const newValue = input || "";
    const inputValue = incomeRef.current;
    if (inputValue) {
      inputValue.value = newValue;
    }

    if (intervalID.current) {
      clearTimeout(intervalID.current);
    }

    intervalID.current = setTimeout(() => {
      setIncome(() => parsetoNum(newValue));
      inputValue.value = convertToFloat(parsetoNum(newValue));
    }, 1000);
  };

  // handle the ongoing category list states of each of the three budget sections
  const [essentialCategories, setEssentialCategories] = useState(
    setActiveCategories(userCategories, "essential")
  );
  const [nonEssentialCategories, setNonEssentialCategories] = useState(
    setActiveCategories(userCategories, "non-essential")
  );
  const [savingCategories, setSavingCategories] = useState(
    setActiveCategories(userCategories, "savings")
  );
  const [inactiveCategories, setInactiveCategories] = useState(
    setInactiveCategoryList(userCategories)
  );

  // handle ongoing state of categories removed by user
  const [addCategoryList, setAddCategoryList] = useState(
    buildInitialAddList(userCategories)
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

  const handleIncomeAmounts = (
    category: category,
    identifier: number,
    remove = false
  ) => {
    let updateIncome = userIncomeCategories.map((cat, index) => {
      return index == identifier ? category : cat;
    });
    if (remove) {
      updateIncome = userIncomeCategories.filter((cat, index) => {
        return index != identifier;
      });
    }
    setUserIncomeCategories(updateIncome);
  };

  const saveBudgetHandler = async () => {
    let expenseCategoriesMerged: category[] = [];
    expenseCategoriesMerged = expenseCategoriesMerged.concat(
      expenseCategoriesMerged,
      essentialCategories,
      nonEssentialCategories,
      savingCategories,
      inactiveCategories
    );

    const updateActiveCheck =
      activeBudgetMonthStart == Number(saveMonthRef.current.value);
    const budgetExists = budgetID >= 0;

    if (!budgetExists) {
      await createBudget(
        expenseCategoriesMerged,
        userIncomeCategories,
        income,
        Number(saveMonthRef.current.value),
        new Date().getFullYear(),
        userID
      );
    } else if (budgetExists && updateActiveCheck) {
      // current active budget and user selected month have same start date, so update existing budget
      await updateActiveBudget(
        expenseCategoriesMerged,
        userIncomeCategories,
        income,
        Number(saveMonthRef.current.value),
        new Date().getFullYear(),
        userID,
        budgetID
      );
    } else if (budgetExists) {
      // current active budget can safely be ended at n-1 user selected month, and create a new one at selected date
      await updateAndCreateBudget(
        expenseCategoriesMerged,
        userIncomeCategories,
        income,
        Number(saveMonthRef.current.value),
        new Date().getFullYear(),
        userID,
        budgetID
      );
    }
    router.refresh();
    setDisplaySaved(() => true);

    successTimer.current = setTimeout(() => {
      setDisplaySaved(() => false);
    }, 3000);
  };

  return (
    <section>
      <label id="income">
        What is your annual income after taxes and deductions?
        <div>
          <span>$</span>{" "}
          <input
            type="text"
            defaultValue={convertToFloat(income)}
            ref={incomeRef}
            onChange={(e) => updateIncome(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Backspace") {
                e.preventDefault();
                updateIncome("");
              }
              if (e.key == "Enter") {
                e.preventDefault();
                const inputValue = incomeRef.current;
                if (inputValue) {
                  setIncome(() => inputValue.value);
                  inputValue.value = convertToFloat(
                    parsetoNum(inputValue.value)
                  );
                }
              }
            }}
          />
        </div>
        {income > 0 && (
          <em>
            your monthly allowance is{" "}
            <strong>${convertToFloat(monthlyIncome)}</strong>
          </em>
        )}
      </label>

      <div className="incomeSection">
        <span id={Math.round(incomeSectionBalance) < 0 ? "negativeTotal" : ""}>
          <p>Balance</p>
          <p>
            $
            {convertToFloat(
              Math.round(incomeSectionBalance) == 0 ? 0 : incomeSectionBalance
            )}
          </p>
        </span>
        {userIncomeCategories.map((cat, index) => (
          <IncomeContainer
            key={index}
            incomeCategory={cat}
            categoryList={[cat, ...incomeCategoryList]}
            monthlyIncome={monthlyIncome}
            index={index}
            setIncomeCallback={handleIncomeAmounts}
          />
        ))}
        {incomeCategoryList.length > 0 && (
          <span id="addIncomeCategory" className="incomeContainer">
            <select
              defaultValue="Add Category"
              onChange={(e) => {
                if (e.target.value != "Add Category") {
                  const newIncomeCategory: category = {
                    category: e.target.value,
                    help: "",
                    min: 0,
                    max: 100,
                    curr: 0,
                    type: "income",
                    active: 1,
                  };
                  setUserIncomeCategories([
                    ...userIncomeCategories,
                    newIncomeCategory,
                  ]);
                  e.target.value = "Add Category";
                }
              }}
            >
              {[
                { ...incomeCategoryList[0], category: "Add Category" },
                ...incomeCategoryList,
              ].map((cat, index) => (
                <option key={index} value={cat.category} label={cat.category} />
              ))}
            </select>
          </span>
        )}
      </div>
    </section>
  );
};

export default incomeCategoryBuilder;
