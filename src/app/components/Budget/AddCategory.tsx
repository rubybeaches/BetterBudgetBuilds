import { category } from "@/app/lib/types";
import { useState } from "react";

const AddCategory = ({ addCategoryList }: { addCategoryList: category[] }) => {
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredList = addCategoryList.sort((a, b) => {
        if (a.type < b.type) { return -1; }
        if (a.type > b.type) { return 1; }
        return 0;
    }).filter(list => {
        if (list.category.toLowerCase().includes(searchQuery.toLowerCase())) {
            return list.category
        }
    });

    const getTypeString = (type: string) => {
        return type == 'essential' ? 'Essentials' : type == 'non-essential' ? "Non-Essentials" : 'Savings';
    }

    return (
        <>
            <div className="addCategoryButton" onClick={() => setSearchActive(() => true)}>Add Category</div>
            <div className={searchActive ? 'categorySearchContainer showElement' : 'categorySearchContainer hideElement'}>
                <input className="categorySearchInput" type="text" placeholder="Search for a category to add..." value={searchQuery} onChange={(e) => setSearchQuery(() => e.target.value)} />
                {searchActive && searchQuery && filteredList.map((category, index) =>
                    <p className="addListItem" key={index}><strong style={{ fontWeight: '500' }} id={getTypeString(category.type)}>{category.category}</strong> in {getTypeString(category.type)}</p>
                )}
                <div className="searchFullBackground" onClick={() => {
                    setSearchActive(() => false);
                    setSearchQuery(() => "");
                }}></div>
            </div>
        </>
    )
}

export default AddCategory;