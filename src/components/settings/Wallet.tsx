import { useEffect, useState } from "react";
import TransactionsTable from "./TransactionTable";
import { getErrorMessage } from "../../init/appValues";
import axios from "../../axios";
import { useToast } from "../../hooks/useToast";
import Toast from "../global/Toast";
import WithdrawalModal from "./WithdrawalModal";

export interface Transaction {
  _id: string;
  user: string; // user ID reference
  accountName: string;
  type: "received" | "sent" | string;
  amount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface Wallet {
  _id: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive" | "suspended" | string;
  user: string;
}

export interface BankDetail {
  _id: string;
  stripeBankAccountId: string;
  accountHolderName: string | null;
  accountNumber: string;
  bankName: string;
  createdAt: string;
  updatedAt: string;
  last4: string;
  routingNumber: string;
  status: string;
  user: string;
  __v: number;
}

const Wallet = () => {
  const { toast, showToast } = useToast();

  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [walletValue, setWalletValue] = useState<Wallet>();
  const [transactionList, setTransactionList] = useState<Transaction[]>();
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const [bankDetail, setBankDetail] = useState<BankDetail[]>();

  const getWalletData = async () => {
    try {
      setState("loading");

      const [walletRes, transactionRes, bankDetail] = await Promise.all([
        axios.get("/stripe/myWallet"),
        axios.get("/stripe/myTransactions"),
        axios.get("/bank"),
      ]);

      if (walletRes.status === 200 && transactionRes.status === 200) {
        console.log("Wallet:", walletRes.data.data);
        console.log("Transactions:", transactionRes.data.data);

        setWalletValue(walletRes.data.data);
        setTransactionList(transactionRes.data.data.transactions);
        setBankDetail(bankDetail.data.data);
        setState("ready");
      }
    } catch (error) {
      console.error("getWalletData error:", error);
      setState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  useEffect(() => {
    getWalletData();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-2 mb-4">
      {state === "error" && <Toast {...toast} />}
      <div className="wallet-gradient w-full rounded-2xl p-4">
        <p className="text-[#ffffff] text-[13px]">Available Balance</p>
        <p className="text-[36px] text-[#ffffff] font-semibold">
          ${walletValue?.balance}
        </p>
        <div className="w-full flex items-center">
          <button
            onClick={() => setIsWithdrawal(true)}
            type="button"
            className="w-full rounded-[8px] gradient-color text-white text-[13px] py-3 px-6 font-medium"
          >
            Withdraw Funds
          </button>
        </div>
      </div>
      <div className="bg-[#ffffff] p-6 w-full rounded-3xl">
        <div className="flex justify-between items-center">
          <p className="text-[#000000] text-[18px] font-semibold">
            Transactions
          </p>
          {/* <div className="p-4 bg-[#fff] px-10">All</div> */}
        </div>
        <div className="w-full mt-2">
          <TransactionsTable transactionList={transactionList} />
        </div>
      </div>
      {isWithdrawal && walletValue && bankDetail && (
        <WithdrawalModal
          onClose={() => setIsWithdrawal(false)}
          balance={walletValue.balance}
          bankDetail={bankDetail}
        />
      )}
    </div>
  );
};

export default Wallet;
