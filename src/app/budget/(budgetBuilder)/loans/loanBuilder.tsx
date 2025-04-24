"use client";
import { useMemo, useRef, useState } from "react";
import {
  buildHelpCategories,
  convertToFloat,
  parsetoNum,
  setActiveCategories,
  sortCategories,
} from "../../../lib/helpers";
// import { useRouter } from "next/navigation";

const activeLoans = [
  {
    name: "Discover Loan",
    amount: 4800,
    startDate: "1/25/2021",
    minPayment: 252,
    term: 60,
    apr: 5.25,
  },
  {
    name: "Tree Loan",
    amount: 2500,
    startDate: "2/24/2024",
    minPayment: 250,
    term: 24,
    apr: 5,
  },
  {
    name: "Mortgage",
    amount: 352000,
    startDate: "6/17/2022",
    minPayment: 1895,
    term: 360,
    apr: 5.35,
  },
];

const LoanBuiler = ({ userID }: { userID: number }) => {
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
        {activeLoans.map((loan) => (
          <div
            className="categorySection loanSection"
            key={loan.name}
            style={{ marginTop: "2px" }}
          >
            <div className="titleBubble">
              <p className="text-red font-bold" style={{ fontSize: "1.25em" }}>
                {loan.name}
              </p>
            </div>
            <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
              <label className="loanInput">
                $ <input name="amount" value={loan.amount} />
              </label>
              <p>Loan Origination Amount</p>
            </div>
            <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
              <label className="loanInput">
                <input name="start date" value={loan.startDate} />
              </label>
              <p>Loan Origination Date (First Payment)</p>
            </div>
            <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
              <label className="loanInput">
                $ <input name="min payment" value={loan.minPayment} />
              </label>
              <p>Minimum Monthly Payment</p>
            </div>
            <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
              <label className="loanInput">
                <input name="term" value={loan.term} />
              </label>
              <p>Loan Term in Months</p>
            </div>
            <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
              <label className="loanInput">
                % <input name="apr %" value={loan.apr} />
              </label>
              <p>Loan APR %</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default LoanBuiler;
