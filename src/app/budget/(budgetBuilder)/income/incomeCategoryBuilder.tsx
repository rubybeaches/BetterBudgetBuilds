"use client";
import { useMemo, useRef, useState } from "react";
import {
  buildInitialAddList,
  convertToFloat,
  parsetoNum,
  setActiveCategories,
  sortCategories,
} from "../../../lib/helpers";
import { category } from "../../../lib/types";
import IncomeContainer from "../../../components/Budget/IncomeContainer";
import { useRouter } from "next/navigation";

const IncomeCategoryBuilder = ({
  incomeCategories,
  baseIncome,
  activeBudgetMonthStart,
  budgetID,
  userID,
}: {
  incomeCategories: category[];
  baseIncome: number;
  activeBudgetMonthStart: number;
  budgetID: number;
  userID: number;
}) => {
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

  return (
    <>
      <section>
        {/* Yearly income bar with input */}
        <label
          style={{
            display: "flex",
            gap: "1em",
            alignItems: "center",
            border: "1px solid white",
            borderTop: "none",
            borderLeft: "none",
            fontWeight: "600",
            color: "#323232",
          }}
        >
          <p style={{ color: "rgb(50 50 50 / 75%)", marginLeft: "12px" }}>
            <em>
              Enter your <u>yearly</u> income after taxes:
            </em>
          </p>
          <div
            className="text-white text-lg"
            style={{ background: "none", border: "none", flex: "1" }}
          >
            <span>$</span>{" "}
            <input
              type="text"
              defaultValue={convertToFloat(income)}
              ref={incomeRef}
              className="text-white"
              style={{ background: "none", width: "90%", fontSize: "1.125rem" }}
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
        </label>
      </section>

      {/* Income Section box with monthly breakdown header */}
      <section className="incomeSection">
        {income > 0 && (
          <em className="font-bold text-lg">
            Your monthly allowance is <u>${convertToFloat(monthlyIncome)}</u>
          </em>
        )}

        {/* Added Categories button and balance remaining*/}
        <span style={{ display: "flex", gap: "15px", margin: "20px auto" }}>
          {incomeCategoryList.length > 0 && (
            <div
              className="addIncome incomeContainer"
              style={{ borderRadius: "50px", padding: "4px 8px" }}
            >
              <select
                defaultValue="Add Category"
                style={{ background: "white" }}
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
            </div>
          )}
          <div
            id={Math.round(incomeSectionBalance) < 0 ? "negativeTotal" : ""}
            className="addIncome"
          >
            <p className="text-green" style={{ fontSize: " 1em" }}>
              Balance to Assign:
              <span className="font-bold">
                ${" "}
                {convertToFloat(
                  Math.round(incomeSectionBalance) == 0
                    ? 0
                    : incomeSectionBalance
                )}
              </span>
            </p>
          </div>
        </span>

        {/* Added Categories in a list */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
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
        </div>
      </section>
    </>
  );
};

export default IncomeCategoryBuilder;
