import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <p>Better Budget Builds</p>
        <a href="/sign-in" className={styles.button}>
          <p>Login</p>
        </a>
      </div>

      <div className={styles.center}>
        <div className={styles.dollar}>
          <p>$$$</p>
        </div>
        <div className={styles.header}>
          <p>Budget, Save, Relax.</p>
        </div>
      </div>

      <div className={styles.grid}>
        <a href="/budget" className={styles.card}>
          <h2>
            Calculate Budget <span>&#8594;</span>
          </h2>
          <img src="/budgetBlocksISO.png" width={300} />
        </a>

        <a href="/" className={styles.card}>
          <h2>
            Create Savings Goals <span>&#8594;</span>
          </h2>
          <img src="/piggyISO.png" width={250} />
        </a>

        <a href="/" className={styles.card}>
          <h2>
            Track Loan Payoffs <span>&#8594;</span>
          </h2>
          <img src="/loanISO.png" width={250} />
        </a>
      </div>
      <div className={styles.description}>
        <h2>Your financial future is a budget away</h2>
        <img src="/dollarSign.png" />
      </div>
    </main>
  );
}
