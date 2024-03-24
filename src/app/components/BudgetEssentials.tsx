// load user profile to pass in category types if they exist, otherwise pass if template profile

import Slider from "./Slider";
import { multiplyPercentToFloat } from "../lib/helpers";
import { useState } from "react";
import BudgetInput from "./BudgetInput";

// category, category help text, percent range, current value as number, current value as %, lump expedenture checked, lump expenditure amount

const BudgetEssentials = ({ categories, income }: { categories: { 'category': string, 'help': string[], 'min': number, 'max': number, 'curr': number }[], income: number }) => {
    // load category calculations - $ from saved profile or default %  if null to perform calc

    // load % ranges and $ for category along with slider and default slider position based on $ or %

    // need running expenses: default monthy total, default percent for essential, category totals, and balnce remaining
    //const [categoryPercents, setCategoryPercents] = useState([])
    //const [categoryTotals, setCategoryTotals] = useState([]);
    const [categoryData, setCategoryData] = useState(categories);

    const updateTotals = (min: number, max: number, current: number, identifier: number) => {
        const updateArray = categoryData.map((cat, index) => {
            if (index == identifier) {
                return { ...cat, min: min, max: max, curr: current };
            } else {
                return { ...cat }
            }
        });
        setCategoryData(updateArray);
    }

    return (
        <div id="essentials" style={{ display: 'flex' }}>
            <div>
                {categoryData.map((cat, index) =>
                    <div key={index} className="categoryRow">
                        <p className="categoryTitle">{cat.category}</p>
                        <span>
                            <p><span className="sliderPercent">({cat.min}%)</span> ${multiplyPercentToFloat(cat.min, income)}</p>
                            <Slider min={cat.min} max={cat.max} position={cat.curr} index={index} positionSetter={updateTotals} />
                            <p><span className="sliderPercent">({cat.max}%)</span> ${multiplyPercentToFloat(cat.max, income)}</p>
                        </span>
                    </div>
                )}
            </div>
            <div className="essentialsBlue">
                {categoryData.map((cat, index) =>
                    <div key={index} style={{ padding: '.25em' }}>
                        <BudgetInput income={income} min={cat.min} max={cat.max} current={cat.curr} index={index} inputSetter={updateTotals} />
                    </div>
                )}
            </div>
        </div>
    )

}

export default BudgetEssentials;