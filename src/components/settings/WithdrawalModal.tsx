import React, { useState } from "react";
import axios from "../../axios";
import { useToast } from "../../hooks/useToast";
import Toast from "../global/Toast";
import { RxCross2 } from "react-icons/rx";
import type { BankDetail } from "./Wallet";

interface Props {
  onClose: () => void;
  balance: number;
  bankDetail: BankDetail[];
}

const WithdrawalModal: React.FC<Props> = ({ onClose, balance, bankDetail }) => {
  console.log("🚀 ~ WithdrawalModal ~ bankDetail:", bankDetail);
  const { toast, showToast } = useToast();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    if (parseFloat(amount) > balance) {
      showToast("Insufficient balance", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/stripe/withdrawFunds", {
        stripeBankAccountId: bankDetail[0]?.stripeBankAccountId,
        amount: parseFloat(amount),
      });
      if (response.status === 200) {
        showToast("Withdrawal successful", "success");
        onClose(); // Close modal after successful withdrawal
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      showToast("Failed to withdraw funds", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#04080680] bg-opacity-0 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[26em] text-center shadow-lg relative ">
        {toast && <Toast {...toast} />}
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <RxCross2 size={24} />
          </button>
          <h2 className="text-[20px] font-semibold mb-4">Withdraw Funds</h2>
        </div>
        {/* <p className="text-[14px] text-gray-500 mb-4">Attached bank account</p> */}
        {/* <div className="flex gap-4 justify-center mb-4">
          <img
            src="/path/to/card1.png"
            alt="Card 1"
            className="h-[80px] rounded-lg shadow-md"
          />
          <img
            src="/path/to/card2.png"
            alt="Card 2"
            className="h-[80px] rounded-lg shadow-md"
          />
        </div> */}
        <div className="flex justify-between items-center h-[100px]">
          <p className="text-[14px] text-gray-500 mb-4">Available balance</p>
          <p className="text-[20px] font-semibold text-[#36C0EF] mb-4">
            ${balance.toFixed(2)}
          </p>
        </div>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-[14px] font-medium mb-2 text-left"
          >
            Enter Amount
          </label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 
            py-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#36C0EF]"
            placeholder="e.g. 120.00"
          />
        </div>
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className={`w-full rounded-lg py-3 text-white font-medium ${
            loading ? "bg-gray-400 cursor-not-allowed" : "gradient-color"
          }`}
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default WithdrawalModal;
