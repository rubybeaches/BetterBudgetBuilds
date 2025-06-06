// load user profile to pass in category types if they exist, otherwise pass if template profile

import Slider from "./Slider";
import { multiplyPercentToFloat, convertToFloat } from "../../lib/helpers";
import BudgetInput from "./BudgetInput";
import CategoryHelpText from "./CategoryHelpText";
import { category } from "../../lib/types";
import AddCategory from "./AddCategory";

// category, category help text, percent range, current value as number, current value as %, lump expedenture checked, lump expenditure amount

const CategorySection = ({
  categories,
  setCategories,
  monthlyIncome,
  type,
  percentTemplate,
  startingBalance,
  removedCategories,
  addCategoryList,
}: {
  categories: category[];
  setCategories: (categories: category[]) => void;
  monthlyIncome: number;
  type: string;
  percentTemplate: number;
  startingBalance: number;
  removedCategories: (removedValue: category) => void;
  addCategoryList: category[];
}) => {
  // load category calculations - $ from saved profile or default %  if null to perform calc
  // load % ranges and $ for category along with slider and default slider position based on $ or %
  // need running expenses: default monthy total, default percent for essential, category totals, and balnce remaining
  const budgetTotals = categories.reduce(
    (sum, cat) => sum + (cat.curr / 100) * monthlyIncome,
    0
  );
  const finalBalance = startingBalance - budgetTotals;
  const budgetEstimate = monthlyIncome * percentTemplate;
  const barHeight = Math.min((budgetTotals / budgetEstimate) * 150, 250);

  const updateTotals = (
    min: number,
    max: number,
    current: number,
    identifier: number
  ) => {
    const updateArray = categories.map((cat, index) => {
      if (index == identifier) {
        return { ...cat, min: min, max: max, curr: current };
      } else {
        return { ...cat };
      }
    });
    setCategories(updateArray);
  };

  //TO_DO: better handling for changing category type
  const addCategory = (category: category) => {
    const updateArray: category[] = categories.map((cat) => cat);
    updateArray.push({
      ...category,
      type: updateArray[0].type,
      active: 1,
      curr: Math.floor(category.max / 2),
    });
    setCategories(updateArray);
    removedCategories({ ...category, active: 1 });
  };

  // Filter out the selected category from the parent section use state category list,
  // and add it plus any help text items to removed use state list.
  const removeCategory = (identifier: number) => {
    const categoryArray = categories.filter((cat, index) => {
      if (index != identifier) {
        return { ...cat };
      } else {
        removedCategories({ ...cat, active: 0 });
      }
    });
    setCategories(categoryArray);
  };

  return (
    <span id={type}>
      <div style={{ position: "relative" }}>
        <AddCategory
          addCategoryList={addCategoryList}
          addCategory={addCategory}
        />
      </div>
      <div className="sectionContainer">
        <div>
          {categories.map((cat, index) => (
            <div key={index} className="categoryRow">
              <div
                className="removeCategory"
                onClick={() => removeCategory(index)}
              >
                <p>x</p>
              </div>
              <CategoryHelpText
                categoryTitle={cat.category}
                showHelp={cat.help.length >= 1}
                helpCategories={cat.help}
              />
              <span className="sliderWrapper">
                <Slider
                  min={cat.min}
                  max={cat.max}
                  position={cat.curr}
                  index={index}
                  positionSetter={updateTotals}
                />
                <p>
                  <span className="sliderPercent">({cat.max}%)</span>
                </p>
              </span>
              <div style={{ padding: ".25em" }}>
                <BudgetInput
                  monthlyIncome={monthlyIncome}
                  min={cat.min}
                  max={cat.max}
                  current={cat.curr}
                  index={index}
                  inputSetter={updateTotals}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="graphContainer">
          <span>
            <p className="graphHeader">
              Selected Totals:<strong> ${convertToFloat(budgetTotals)}</strong>
            </p>
          </span>
          <div
            className="budgetGraph"
            style={{
              marginTop: `${barHeight > 150 ? barHeight - 150 + 20 : 20}px`,
            }}
          >
            <div className="budgetTotalChart">
              <div
                className="innerBar"
                style={{ height: `${barHeight}px` }}
              ></div>
              <p
                className={`${barHeight > 70 ? "text-white" : `${type}-text`}`}
              >
                ${convertToFloat(budgetTotals)}
              </p>
            </div>
            <div className="budgetTotalChart">
              <p>${budgetEstimate.toFixed()}</p>
            </div>
          </div>
          <span
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              gap: "1em",
              marginTop: "6px",
              fontSize: ".85em",
              fontWeight: "500",
            }}
          >
            <p>Selected Totals</p>
            <p>
              <strong> ${convertToFloat(monthlyIncome)}</strong> *{" "}
              {percentTemplate * 100}%
            </p>
          </span>
        </div>
        <div className="summaryTotals">
          <p>${convertToFloat(startingBalance)}</p>
          <p>${convertToFloat(budgetTotals)}</p>
          <p id={Math.round(finalBalance) < 0 ? "negativeTotal" : ""}>
            ${convertToFloat(Math.round(finalBalance) == 0 ? 0 : finalBalance)}
          </p>
        </div>
      </div>
    </span>
  );
};

export default CategorySection;
