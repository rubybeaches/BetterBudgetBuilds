"use client";
import "./page.css";
import { useEffect, useMemo, useRef, useState } from "react";
import CategorySection from "../components/Budget/CategorySection";
import {
  allMonths,
  buildInitialAddList,
  convertToFloat,
  parsetoNum,
  setActiveCategories,
  setInactiveCategoryList,
  sortCategories,
} from "../lib/helpers";
import { category } from "../lib/types";
import IncomeContainer from "../components/Budget/IncomeContainer";
import SuccessPopUp from "../components/SuccessPopUp";
import { createBudget } from "../lib/actions";

const Budget = ({
  expenseCategories,
  incomeCategories,
  baseIncome,
  activeBudgetMonthStart,
  userID,
}: {
  expenseCategories: category[];
  incomeCategories: category[];
  baseIncome: number;
  activeBudgetMonthStart: number;
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
  const successTimer = useRef<any>();
  let month = new Date().toLocaleString("en-US", { month: "long" });

  /*
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
  */

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

  // Determines what method of budget creation to use
  // We determine if a budget exists by checking default income, if not then simple create call
  // // income default is 0 when budget does not exist, and we prevent creating a budget with 0 for income
  // Our next check is whether to update or replace the current active budget
  // // Elsewhere, we restrict overriding previous non-active budgets by disabling months before activeBudgetStart
  // We check if the user selected month differs from the active start month
  // To datermine to either set an end date for prior active budget and then create new active,
  // // set end of n-1 of user selected month. This allows both past and future selected months to be updated correctly
  // // works for future months too because it updates active budget start - which means all months before that would be disabled
  // OR update/replace the current active budget if it starts in the same month the user selected
  const saveBudget = async () => {
    let mergeBudgetArrays: category[] = [];
    mergeBudgetArrays = mergeBudgetArrays.concat(
      mergeBudgetArrays,
      essentialCategories,
      nonEssentialCategories,
      savingCategories,
      inactiveCategories
    );

    const replaceActiveBudget = activeBudgetMonthStart == saveMonthRef.current;
    const budgetExists = baseIncome == 0;

    if (!budgetExists) {
      return await createBudget(
        mergeBudgetArrays,
        userIncomeCategories,
        income,
        saveMonthRef.current,
        new Date().getFullYear(),
        userID
      );

      if (budgetExists && replaceActiveBudget) {
        // current budget is active starting this month, and new save budget is for this month so just update existing one
      }
    }

    // localStorage.setItem("userCategories", JSON.stringify(mergeBudgetArrays));
    // localStorage.setItem("income", JSON.stringify(income));
    // localStorage.setItem("userIncomeCategories",JSON.stringify(userIncomeCategories));

    setDisplaySaved(() => true);

    successTimer.current = setTimeout(() => {
      setDisplaySaved(() => false);
    }, 3000);
  };
  // need a reset button so users can start from scratch if needed, and update with new salary

  return (
    <>
      <main className="main budgetTop">
        <span className="borderTop"></span>
        <span className="border left"></span>
        <span className="border right"></span>
        <div>
          <h2>Budget Calculator</h2>
          <p>
            Let's generate a basic bucketing system based on national averages.
            Don't worry about getting it perfect the first time, you can revisit
            this at anytime and update your budget moving forward. We've
            provided percentages based on what is most recommended as a
            guidepost, and you can adjust the categories and buckets to your
            needs. If you're unsure of what you should put in any given bucket,
            use your best guess until you have a better idea.
          </p>

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
            <span
              id={Math.round(incomeSectionBalance) < 0 ? "negativeTotal" : ""}
            >
              <p>Balance</p>
              <p>
                $
                {convertToFloat(
                  Math.round(incomeSectionBalance) == 0
                    ? 0
                    : incomeSectionBalance
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
            <div className="applyBudgetWrapper">
              <p>Apply budget starting in</p>
              <div className="saveBudgetContainer">
                <p className="monthTitle">
                  <select
                    defaultValue={new Date().getMonth() + 1}
                    ref={saveMonthRef}
                  >
                    {allMonths.map((m, index) => (
                      <option
                        key={index}
                        value={index + 1}
                        label={m}
                        disabled={index < activeBudgetMonthStart}
                      />
                    ))}
                  </select>
                </p>
              </div>
              <div
                className="saveBudgetContainer"
                onClick={() => {
                  if (income == 0) return;
                  saveBudget();
                }}
              >
                <div className="saveBudget">
                  <p className="saveBudgetButton">
                    <svg
                      viewBox="0 0 161 160"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="matrix(1,0,0,1,-12211.6,-1.42109e-14)">
                        <g transform="matrix(0.291801,0,0,0.406683,8495.88,-3.69116)">
                          <g transform="matrix(4.25343,0,0,3.02405,-41497.1,-63.4492)">
                            <path d="M12768.8,153.722L12768.8,104.686L12862.7,104.686L12862.7,153.722L12878.8,153.722L12878.8,33.69C12878.8,28.333 12874.5,23.983 12869.1,23.983L12760.1,23.983C12754.5,23.983 12749.9,28.573 12749.9,34.227L12749.9,153.722L12768.8,153.722Z" />
                          </g>
                        </g>
                        <g transform="matrix(0.291801,0,0,0.406683,8495.88,-3.69116)">
                          <g transform="matrix(14.1252,0,0,27.407,-9379.2,-26579.6)">
                            <rect
                              x="1583.32"
                              y="979.914"
                              width="12.823"
                              height="4.19"
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                    Save
                  </p>
                </div>
              </div>
            </div>
            <a href="/dashboard">
              <div
                className="saveBudgetContainer"
                style={{ marginRight: "2px" }}
              >
                <div className="saveBudget" style={{ padding: "8px 18px" }}>
                  <p className="saveBudgetButton">Dashboard &#8594;</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </main>
      {displaySaved && (
        <span
          onClick={() => {
            clearTimeout(successTimer.current);
            setDisplaySaved(() => false);
          }}
        >
          <SuccessPopUp message={`New Budget Saved Starting ${month}`} />
        </span>
      )}
    </>
  );
};

export default Budget;
