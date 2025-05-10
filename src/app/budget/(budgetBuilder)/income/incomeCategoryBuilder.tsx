"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildHelpCategories,
  convertToFloat,
  parsetoNum,
  setActiveCategories,
  sortCategories,
} from "../../../lib/helpers";
import { category } from "../../../lib/types";
import IncomeContainer from "../../../components/Budget/IncomeContainer";
import {
  updateBudgetIncome,
  updateBudgetIncomeCategories,
} from "@/app/lib/actions";
import { useSave } from "@/app/lib/useSave";
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
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  const [income, setIncome] = useState(baseIncome);
  const monthlyIncome = income / 12;

  const [activeIncomeCategories, setActiveIncomeCategories] = useState(
    setActiveCategories(incomeCategories, "income")
  );
  const dropDownCategoryList = useMemo(() => {
    const alreadyActive = new Set(
      activeIncomeCategories.map((cat) => cat.category)
    );
    let helpCategories = buildHelpCategories(incomeCategories).filter(
      (filter) => {
        let active = alreadyActive.has(filter.category);
        if (!active) return filter;
      }
    );
    let currentDropDown = new Set(helpCategories.map((cat) => cat.category));
    let inactiveCategories = incomeCategories.filter((filter) => {
      let active = alreadyActive.has(filter.category);
      let dropDown = currentDropDown.has(filter.category);
      if (!active && !dropDown) return { ...filter, active: 0 };
    });

    return sortCategories(
      [...helpCategories, ...inactiveCategories],
      "category"
    );
  }, [activeIncomeCategories]);

  const incomeRef = useRef<any>();
  const incomeSectionBalance =
    monthlyIncome -
    activeIncomeCategories.reduce(
      (sum, cat) => (cat.curr * monthlyIncome) / 100 + sum,
      0
    );

  const updateBaseIncome = async () => {
    const inputValue = incomeRef.current;
    if (!inputValue) return;

    console.log("input value", inputValue.value);

    let newIncome = convertToFloat(parsetoNum(inputValue.value));
    console.log("parsedValue", newIncome);

    inputValue.value = newIncome;

    setIncome(() => parsetoNum(newIncome));
    await updateBudgetIncome(parsetoNum(newIncome), userID, budgetID);
  };
  const debounceSaveIncome = useSave(updateBaseIncome, 1000);

  const updateActiveIncomeInputs = async (
    category: category,
    identifier: number,
    remove = false
  ) => {
    if (remove) {
      let updatedCategories = activeIncomeCategories.filter((cat, index) => {
        return index != identifier;
      });
      setActiveIncomeCategories(() => updatedCategories);
      await updateBudgetIncomeCategories(updatedCategories, budgetID);
      return;
    }

    let newActiveCategories = activeIncomeCategories.map((cat, index) => {
      return index == identifier ? category : cat;
    });
    setActiveIncomeCategories(() => newActiveCategories);
    await updateBudgetIncomeCategories(newActiveCategories, budgetID);
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
              {...debounceSaveIncome}
            />
          </div>
        </label>
      </section>

      {/* Income Section box with monthly breakdown header */}
      <section className="categorySection incomeSection">
        {income > 0 && (
          <em className="font-bold text-lg">
            Your monthly allowance is <u>${convertToFloat(monthlyIncome)}</u>
          </em>
        )}

        {/* Added Categories button and balance remaining*/}
        <span style={{ display: "flex", gap: "15px", margin: "20px auto" }}>
          {dropDownCategoryList.length > 0 && (
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
                    setActiveIncomeCategories([
                      ...activeIncomeCategories,
                      newIncomeCategory,
                    ]);
                    e.target.value = "Add Category";
                  }
                }}
              >
                {[
                  { ...dropDownCategoryList[0], category: "Add Category" },
                  ...dropDownCategoryList,
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
            <p
              className="text-green"
              style={{ fontSize: " 1em", fontWeight: "500" }}
            >
              Balance to Assign:{" "}
              <span className="font-bold">
                $
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
          {activeIncomeCategories.map((cat, index) => (
            <IncomeContainer
              key={index}
              incomeCategory={cat}
              categoryList={[cat, ...dropDownCategoryList]}
              monthlyIncome={monthlyIncome}
              index={index}
              setIncomeCallback={updateActiveIncomeInputs}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default IncomeCategoryBuilder;
