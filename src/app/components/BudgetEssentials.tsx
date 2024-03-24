// load user profile to pass in category types if they exist, otherwise pass if template profile

// category, category help text, percent range, current value as number, current value as %, lump expedenture checked, lump expenditure amount

const BudgetEssentials = ({ categories, income }: { categories: { 'category': string, 'help': string[], 'min': number, 'max': number, 'curr': number }[], income: number }) => {
    // load category calculations - $ from saved profile or default %  if null to perform calc

    // load % ranges and $ for category along with slider and default slider position based on $ or %

    // need running expenses: default monthy total, default percent for essential, category totals, and balnce remaining

    const convertToFloat = (number: number) => {
        return (number * income / 100).toFixed(2);
    }

    return (
        <div id="essentials" style={{ display: 'flex' }}>
            <div>
                {categories.map((cat, index) =>
                    <div key={index} className="categoryRow">
                        <p className="categoryTitle">{cat.category}</p>
                        <span>
                            <p><span className="sliderPercent">({cat.min}%)</span>${convertToFloat(cat.min)}</p>
                            <input type="range" min={cat.min} max={cat.max} value={cat.curr}></input>
                            <p><span className="sliderPercent">({cat.max}%)</span>${convertToFloat(cat.max)}</p>
                        </span>
                    </div>
                )}
            </div>
            <div className="essentialsBlue">
                {categories.map((cat, index) =>
                    <div key={index} style={{ padding: '.25em' }}>
                        <div><span>$</span> <input type="number" value={convertToFloat(cat.curr) || 0} /></div>
                    </div>
                )}
            </div>
        </div>
    )

}

export default BudgetEssentials;