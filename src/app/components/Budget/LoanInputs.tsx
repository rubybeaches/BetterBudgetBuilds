import { updateLoan } from "@/app/lib/actions";
import { loan } from "@/app/lib/types";
import { useSave } from "@/app/lib/useSave";
import { useRef } from "react";

export const LoanInputs = ({
  loan,
  userID,
}: {
  loan: loan;
  userID: number;
}) => {
  const amountRef = useRef<any>();
  const dateRef = useRef<any>();
  const paymentRef = useRef<any>();
  const termRef = useRef<any>();
  const aprRef = useRef<any>();

  const saveLoan = async () => {
    await updateLoan(
      loan.name,
      Number(amountRef.current.value),
      dateRef.current.value,
      Number(paymentRef.current.value),
      Number(termRef.current.value),
      Number(aprRef.current.value),
      loan.id,
      userID
    );
  };

  const debounceSave = useSave(saveLoan, 2000);

  return (
    <>
      <div className="titleBubble">
        <p className="text-red font-bold" style={{ fontSize: "1.25em" }}>
          {loan.name}
        </p>
      </div>
      <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
        <label className="loanInput">
          ${" "}
          <input
            name="amount"
            type="number"
            defaultValue={loan.amount}
            {...debounceSave}
            ref={amountRef}
          />
        </label>
        <p>Loan Origination Amount</p>
      </div>
      <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
        <label className="loanInput">
          <input
            name="start date"
            defaultValue={loan.startDate.toISOString()}
            {...debounceSave}
            ref={dateRef}
          />
        </label>
        <p>Loan Origination Date (First Payment)</p>
      </div>
      <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
        <label className="loanInput">
          ${" "}
          <input
            name="min payment"
            type="number"
            defaultValue={loan.minPayment}
            {...debounceSave}
            ref={paymentRef}
          />
        </label>
        <p>Minimum Monthly Payment</p>
      </div>
      <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
        <label className="loanInput">
          <input
            name="term"
            type="number"
            defaultValue={loan.term}
            {...debounceSave}
            ref={termRef}
          />
        </label>
        <p>Loan Term in Months</p>
      </div>
      <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
        <label className="loanInput">
          %{" "}
          <input
            name="apr %"
            type="number"
            defaultValue={loan.apr}
            {...debounceSave}
            ref={aprRef}
          />
        </label>
        <p>Loan APR %</p>
      </div>
    </>
  );
};
