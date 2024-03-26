// load user profile to pass in category types if they exist, otherwise pass if template profile

import Slider from "./Slider";
import { multiplyPercentToFloat, convertToFloat } from "../lib/helpers";
import { useState } from "react";
import BudgetInput from "./BudgetInput";

// category, category help text, percent range, current value as number, current value as %, lump expedenture checked, lump expenditure amount

const BudgetEssentials = ({ categories, income }: { categories: { 'category': string, 'help': string[], 'min': number, 'max': number, 'curr': number, 'type': string, 'active': number }[], income: number }) => {
    // load category calculations - $ from saved profile or default %  if null to perform calc

    // load % ranges and $ for category along with slider and default slider position based on $ or %

    // need running expenses: default monthy total, default percent for essential, category totals, and balnce remaining
    //const [categoryPercents, setCategoryPercents] = useState([])
    //const [categoryTotals, setCategoryTotals] = useState([]);
    const [categoryData, setCategoryData] = useState(categories);
    const budgetTotals = categoryData.reduce((sum, cat) => sum + (cat.curr / 100 * income), 0);
    const essentialsEstimate = income * .6;
    const essentialBarHeight = budgetTotals / essentialsEstimate * 150;
    const essentialRemaining = convertToFloat(income - budgetTotals);

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
        <>
            <h3 id="essentialsHeader">Essentials <em>(60%)</em></h3>
            <div id="essentials" style={{ display: 'flex', gap: '1em' }}>
                <div>
                    {categoryData.map((cat, index) =>
                        <div key={index} className="categoryRow">
                            <div className="removeCategory"><p>x</p></div>
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
                <div className="graphContainer">
                    <span>
                        <p><em><strong>${convertToFloat(income)}</strong> at 60% is ~<u>${essentialsEstimate.toFixed()}</u></em></p>
                        <p style={{ marginTop: '12px' }}><strong>Planned Total: ${convertToFloat(budgetTotals)}</strong></p>
                    </span>
                    <div className="budgetGraph" style={{ marginTop: `${essentialBarHeight > 150 ? essentialBarHeight - 150 + 20 : 20}px` }}>
                        <div className="budgetTotalChart"><div className="innerBar" style={{ height: `${essentialBarHeight}px` }}></div><p>${convertToFloat(budgetTotals)}</p></div>
                        <div className="budgetTotalChart"><p>${essentialsEstimate.toFixed()}</p></div>
                    </div>
                    <span style={{ display: 'flex', justifyContent: 'space-evenly', gap: '1em', marginTop: '6px', fontSize: '.85em', fontWeight: '500' }}>
                        <p>Planned Total</p>
                        <p>60% Template</p>
                    </span>
                </div>
                <div className="summaryTotals">
                    <p>${convertToFloat(income)}</p>
                    <p>${convertToFloat(budgetTotals)}</p>
                    <p>${essentialRemaining}</p>
                </div>
            </div>
        </>
    )

}

export default BudgetEssentials;