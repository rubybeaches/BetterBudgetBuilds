"use client";
import { useMemo, useRef, useState } from "react";
import {
  buildHelpCategories,
  convertToFloat,
  parsetoNum,
  setActiveCategories,
  sortCategories,
} from "../../../lib/helpers";
import { loan } from "@/app/lib/types";
import { createLoan } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { LoanInputs } from "@/app/components/Budget/LoanInputs";

const defaultLoan = {
  name: "",
  amount: 0,
  startDate: new Date().toISOString(),
  minPayment: 0,
  term: 0,
  apr: 0,
};

const LoanBuiler = ({ userID, loans }: { userID: number; loans: loan[] }) => {
  const router = useRouter();
  const addInputRef = useRef<any>();
  const loanGrouperRef = useRef<any>();

  const addLoan = async () => {
    const input = addInputRef.current;
    if (!input.value) return;

    let newLoan = defaultLoan;
    newLoan.name = input.value;

    await createLoan(
      newLoan.name,
      newLoan.amount,
      newLoan.startDate,
      newLoan.minPayment,
      newLoan.term,
      newLoan.apr,
      userID
    );
    router.refresh();
    input.value = "";
    await loanGrouperRef.current;
    loanGrouperRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  return (
    <>
      <section>
        {/* Add Loan input */}
        <label
          style={{
            display: "flex",
            gap: "1em",
            alignItems: "center",
            border: "1px solid white",
            borderTop: "none",
            borderLeft: "none",
            fontWeight: "600",
            color: "#323232",
          }}
        >
          <p style={{ color: "rgb(50 50 50 / 75%)", marginLeft: "12px" }}>
            <em>Type loan name like School Loan, Car Loan...</em>
          </p>
          <div
            className="text-white text-lg"
            style={{ background: "none", border: "none", flex: "1" }}
          >
            <input
              type="text"
              className="text-white"
              style={{ background: "none", width: "90%", fontSize: "1.125rem" }}
              ref={addInputRef}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  e.preventDefault();
                  addLoan();
                }
              }}
            />
          </div>
          <div
            className="text-red text-lg"
            style={{
              backgroundColor: "white",
              width: "fit-content",
              padding: "1px 10px 1px 8px",
              borderRadius: "20px",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              margin: "0 4px 4px 0",
              cursor: "pointer",
            }}
            onClick={() => addLoan()}
          >
            <span style={{ fontSize: "1.75rem", lineHeight: "0.875em" }}>
              &#x2B;
            </span>{" "}
            Add
          </div>
        </label>
      </section>

      {/* loan terms */}
      <section
        style={{
          display: "flex",
          gap: ".875em",
          marginTop: "40px",
          flexWrap: "wrap",
        }}
      >
        {loans.map((loan) => (
          <div
            className="categorySection loanSection"
            key={loan.id}
            style={{ marginTop: "2px" }}
            ref={loanGrouperRef}
          >
            <LoanInputs loan={loan} userID={userID} />
          </div>
        ))}
      </section>
    </>
  );
};

export default LoanBuiler;
