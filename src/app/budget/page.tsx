import styles from "./page.module.css";

const Budget = () => {
    return (
        <main className={styles.main}>
            <h2>Budget Calculator</h2>
            <p>Let's generate a basic bucketing system based on national averages. Don't worry about getting it perfect the first time, you can revisit this at anytime and update your budget moving forward. We've provided percentages based on what is most recommended as a guidepost,  and you can adjust the categories and buckets to your needs. If you're unsure of what you should put in any given bucket, use your best guess or put $0 until you have a better idea.</p>

            <label>What is your annual income after taxes and deductions?
                <div><span>$</span> <input type="text" value="0" /></div>
            </label>

            {
                // load user profile or template profile
                // if using template profile, aka no user, then values should be all percent based so they can be dynamic

                // need a reset button so users can start from scratch if needed, and update with new salary
            }

        </main>);
}

export default Budget;