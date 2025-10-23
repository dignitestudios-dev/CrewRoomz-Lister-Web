import { useState } from "react";
import type { Transaction } from "./Wallet";

interface TransactionsTableProps {
  transactionList?: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactionList,
}) => {
  const headers = ["Date", "Account Name", "Type", "Amount"];
  const [activeTab, setActiveTab] = useState("All");

  // Normalize tab labels to match data
  const tabMap: { [key: string]: string } = {
    All: "All",
    Received: "received",
    Withdraw: "withdraw", // adjust if your API uses a different label
  };

  // Filter transactions based on tab
  const filteredTransactions =
    activeTab === "All"
      ? transactionList ?? []
      : (transactionList ?? []).filter(
          (item) => item.type.toLowerCase() === tabMap[activeTab]
        );

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {["All", "Received", "Withdraw"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-gray-100 gradient-text border-b-2 border-b-[#36C0EF]"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-4 gap-2 border-b-2 border-b-[#E3DBDB] pb-2 mt-6">
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
      {filteredTransactions?.map((transaction) => (
        <div
          key={transaction._id}
          className="grid grid-cols-4 gap-2 py-4 border-b-[0.5px] border-b-[#E3DBDB30] text-[12px] text-[#181818] bg-[#F9F9F980] text-center"
        >
          <div>{new Date(transaction.createdAt).toLocaleDateString()}</div>
          <div>{transaction.accountName}</div>
          <div>{transaction.type}</div>
          <div>${transaction.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsTable;
