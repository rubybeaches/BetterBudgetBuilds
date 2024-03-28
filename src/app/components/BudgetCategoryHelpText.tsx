import { useState } from "react";

const BudgetCategoryHelpText = ({ categoryTitle, showHelp, helpCategories }: { categoryTitle: string, showHelp: boolean, helpCategories: string[] }) => {

    const [helpTextBool, setHelpTextBool] = useState(false);

    return (
        <>
            <p className={showHelp ? 'categoryTitleUnderline' : 'categoryTitle'} onMouseEnter={() => setHelpTextBool(() => true)}>{categoryTitle}</p>
            <div className={helpTextBool && showHelp ? 'categoryHelpText showHelp' : 'categoryHelpText hideHelp'} onMouseLeave={() => setHelpTextBool(() => false)}>
                <p className="categoryTitle">{categoryTitle}</p>
                <p>This is a general category that may contain any of the following types of expenses. You may also create a new category to specify any of individual expenses.</p>
                {helpCategories.map((cat, index) =>
                    <p key={index}>{cat}</p>
                )}
            </div>
        </>
    )
}

export default BudgetCategoryHelpText;