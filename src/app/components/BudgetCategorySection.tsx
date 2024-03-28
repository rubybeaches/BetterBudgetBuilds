// load user profile to pass in category types if they exist, otherwise pass if template profile

import Slider from "./Slider";
import { multiplyPercentToFloat, convertToFloat } from "../lib/helpers";
import BudgetInput from "./BudgetInput";
import BudgetCategoryHelpText from "./BudgetCategoryHelpText";

// category, category help text, percent range, current value as number, current value as %, lump expedenture checked, lump expenditure amount

type category = {
    'category': string, 'help': string[], 'min': number, 'max': number, 'curr': number, 'type': string, 'active': number
}

const BudgetCategorySection = ({ categories, setCategories, monthlyIncome, type, percentTemplate, startingBalance }: { categories: category[], setCategories: (categories: category[]) => void, monthlyIncome: number, type: string, percentTemplate: number, startingBalance: number }) => {
    // load category calculations - $ from saved profile or default %  if null to perform calc

    // load % ranges and $ for category along with slider and default slider position based on $ or %

    // need running expenses: default monthy total, default percent for essential, category totals, and balnce remaining
    const budgetTotals = categories.reduce((sum, cat) => sum + (cat.curr / 100 * monthlyIncome), 0);
    const budgetEstimate = monthlyIncome * percentTemplate;
    const barHeight = budgetTotals / budgetEstimate * 150;

    const updateTotals = (min: number, max: number, current: number, identifier: number) => {
        const updateArray = categories.map((cat, index) => {
            if (index == identifier) {
                return { ...cat, min: min, max: max, curr: current };
            } else {
                return { ...cat }
            }
        });
        setCategories(updateArray);
    }

    return (
        <span id={type}>
            <h3 id="sectionHeader">{type} <em>({percentTemplate * 100}%)</em></h3>
            <div className="sectionContainer">
                <div>
                    {categories.map((cat, index) =>
                        <div key={index} className="categoryRow">
                            <div className="removeCategory"><p>x</p></div>
                            <BudgetCategoryHelpText categoryTitle={cat.category} showHelp={cat.help.length >= 1} helpCategories={cat.help} />
                            <span>
                                <p><span className="sliderPercent">({cat.min}%)</span> ${multiplyPercentToFloat(cat.min, monthlyIncome)}</p>
                                <Slider min={cat.min} max={cat.max} position={cat.curr} index={index} positionSetter={updateTotals} />
                                <p><span className="sliderPercent">({cat.max}%)</span> ${multiplyPercentToFloat(cat.max, monthlyIncome)}</p>
                            </span>
                        </div>
                    )}
                </div>
                <div className="sectionBGColor">
                    {categories.map((cat, index) =>
                        <div key={index} style={{ padding: '.25em' }}>
                            <BudgetInput monthlyIncome={monthlyIncome} min={cat.min} max={cat.max} current={cat.curr} index={index} inputSetter={updateTotals} />
                        </div>
                    )}
                </div>
                <div className="graphContainer">
                    <span>
                        <p className="graphHeader"><em><strong>${convertToFloat(monthlyIncome)}</strong> at {percentTemplate * 100}% is ~<u>${budgetEstimate.toFixed()}</u></em></p>
                        <p style={{ marginTop: '12px' }}><strong>Selected Totals: ${convertToFloat(budgetTotals)}</strong></p>
                    </span>
                    <div className="budgetGraph" style={{ marginTop: `${barHeight > 150 ? barHeight - 150 + 20 : 20}px` }}>
                        <div className="budgetTotalChart"><div className="innerBar" style={{ height: `${barHeight}px` }}></div><p>${convertToFloat(budgetTotals)}</p></div>
                        <div className="budgetTotalChart"><p>${budgetEstimate.toFixed()}</p></div>
                    </div>
                    <span style={{ display: 'flex', justifyContent: 'space-evenly', gap: '1em', marginTop: '6px', fontSize: '.85em', fontWeight: '500' }}>
                        <p>Selected Totals</p>
                        <p>{percentTemplate * 100}% Template</p>
                    </span>
                </div>
                <div className="summaryTotals">
                    <p>${convertToFloat(startingBalance)}</p>
                    <p>${convertToFloat(budgetTotals)}</p>
                    <p id={startingBalance - budgetTotals < 0 ? 'negativeTotal' : ''}>${convertToFloat(startingBalance - budgetTotals)}</p>
                </div>
            </div>
        </span >
    )

}

export default BudgetCategorySection;