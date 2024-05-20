"use client";
import "./page.css";
import categories from "../lib/seed.json";
import { useEffect, useMemo, useRef, useState } from "react";
import CategorySection from "../components/Budget/CategorySection";
import {
  buildInitialAddList,
  convertToFloat,
  defaultIncomeCategories,
  parsetoNum,
  setActiveCategories,
  setInactiveCategoryList,
  sortCategories,
} from "../lib/helpers";
import { category } from "../lib/types";
import IncomeContainer from "../components/Budget/IncomeContainer";

const Budget = () => {
  const [userCategories, setUserCategories] = useState(categories);
  const [userIncomeCategories, setUserIncomeCategories] = useState(
    setActiveCategories(defaultIncomeCategories, "income")
  );
  const [income, setIncome] = useState(0);
  const incomeCategoryList = useMemo(
    () =>
      sortCategories(
        [
          ...defaultIncomeCategories,
          ...buildInitialAddList(defaultIncomeCategories),
        ].filter((filter) => {
          let include = true;
          userIncomeCategories.map((cat) => {
            if (filter.category == cat.category) include = false;
          });
          if (include) return filter;
        }),
        "category"
      ),
    [userIncomeCategories]
  );

  useEffect(() => {
    const items: any = localStorage.getItem("userCategories");
    const incomeCats: any = localStorage.getItem("userIncomeCategories");
    if (items) {
      const sortedCategories = sortCategories(JSON.parse(items), "category");
      setUserCategories(sortedCategories);
      setEssentialCategories(
        setActiveCategories(sortedCategories, "essential")
      );
      setNonEssentialCategories(
        setActiveCategories(sortedCategories, "non-essential")
      );
      setSavingCategories(setActiveCategories(sortedCategories, "savings"));
      setInactiveCategories(setInactiveCategoryList(sortedCategories));
      setAddCategoryList(buildInitialAddList(sortedCategories));
    }
    const income: any = localStorage.getItem("income");
    if (income) {
      updateIncome(String(JSON.parse(income)));
    }
    if (incomeCats) {
      const sortedIncomeCategories = sortCategories(
        JSON.parse(incomeCats),
        "category"
      );
      setUserIncomeCategories(
        setActiveCategories(sortedIncomeCategories, "income")
      );
    }
  }, []);

  const intervalID = useRef<any>();
  const incomeRef = useRef<any>();
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

  const saveBudget = () => {
    let mergeBudgetArrays: category[] = [];
    mergeBudgetArrays = mergeBudgetArrays.concat(
      mergeBudgetArrays,
      essentialCategories,
      nonEssentialCategories,
      savingCategories,
      inactiveCategories
    );
    localStorage.setItem("userCategories", JSON.stringify(mergeBudgetArrays));
    localStorage.setItem("income", JSON.stringify(income));
    localStorage.setItem(
      "userIncomeCategories",
      JSON.stringify(userIncomeCategories)
    );
  };
  // load user profile or template profile
  // if using template profile, aka no user, then values should be all percent based so they can be dynamic

  // need a reset button so users can start from scratch if needed, and update with new salary

  return (
    <>
      <main className="main budgetTop">
        <h2>Budget Calculator</h2>
        <p>
          Let's generate a basic bucketing system based on national averages.
          Don't worry about getting it perfect the first time, you can revisit
          this at anytime and update your budget moving forward. We've provided
          percentages based on what is most recommended as a guidepost, and you
          can adjust the categories and buckets to your needs. If you're unsure
          of what you should put in any given bucket, use your best guess until
          you have a better idea.
        </p>

        <label id="income">
          What is your annual income after taxes and deductions?
          <div>
            <span>$</span>{" "}
            <input
              type="text"
              defaultValue={0}
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
          <span
            id={Math.round(incomeSectionBalance) < 0 ? "negativeTotal" : ""}
          >
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
                      help: [],
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
                  <option
                    key={index}
                    value={cat.category}
                    label={cat.category}
                  />
                ))}
              </select>
            </span>
          )}
        </div>
      </main>

      <main className="main budgetBottom">
        <div className="budgetExpenseWrapper">
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

          <CategorySection
            categories={nonEssentialCategories}
            setCategories={setNonEssentialCategories}
            type="Non-Essentials"
            monthlyIncome={monthlyIncome || 0}
            percentTemplate={0.3}
            startingBalance={
              monthlyIncome -
              essentialCategories.reduce(
                (sum, cat) => sum + (cat.curr / 100) * monthlyIncome,
                0
              )
            }
            removedCategories={handleAddCategoryList}
            addCategoryList={addCategoryList}
          />

          <CategorySection
            categories={savingCategories}
            setCategories={setSavingCategories}
            type="Savings"
            monthlyIncome={monthlyIncome || 0}
            percentTemplate={0.1}
            startingBalance={
              monthlyIncome -
              essentialCategories.reduce(
                (sum, cat) => sum + (cat.curr / 100) * monthlyIncome,
                0
              ) -
              nonEssentialCategories.reduce(
                (sum, cat) => sum + (cat.curr / 100) * monthlyIncome,
                0
              )
            }
            removedCategories={handleAddCategoryList}
            addCategoryList={addCategoryList}
          />

          <div className="baseBar">
            <div className="saveBudgetContainer" onClick={() => saveBudget()}>
              <div className="saveBudget">
                <p className="saveBudgetButton">Apply Budget</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Budget;
