import { useState } from "react";

const TransactionsTable = () => {
  const headers = ["Date", "Account Name", "Type", "Amount"];
  const transactionData = [
    {
      date: "2025-09-25",
      accountName: "Savings Account",
      type: "Received",
      amount: "$500",
    },
    {
      date: "2025-09-27",
      accountName: "Checking Account",
      type: "Withdraw",
      amount: "$200",
    },
    {
      date: "2025-09-30",
      accountName: "Business Account",
      type: "Received",
      amount: "$1000",
    },
  ];

  const [activeTab, setActiveTab] = useState("All");

  // Filter transactions based on tab
  const filteredTransactions =
    activeTab === "All"
      ? transactionData
      : transactionData.filter((item) => item.type === activeTab);
  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4">
        {["All", "Received", "Withdraw"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-gray-100 gradient-text border-b-2 border-b-[#36C0EF]"
                : " text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Header Row */}
      <div className="grid grid-cols-4 gap-2 border-b-2 border-b-[#E3DBDB] pb-2 mt-6 ">
        {headers.map((header, index) => (
          <div
            key={index}
            className="text-[#36C0EF] font-semibold text-sm text-center"
          >
            {header}
          </div>
        ))}
      </div>

      {/* Body Rows */}
      {filteredTransactions.map((transaction, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-2 py-4 border-b-[0.5px] border-b-[#E3DBDB30] text-[12px] text-[#181818] bg-[#F9F9F980] text-center"
        >
          <div>{transaction.date}</div>
          <div>{transaction.accountName}</div>
          <div>{transaction.type}</div>
          <div>{transaction.amount}</div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsTable;
