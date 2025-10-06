import TransactionsTable from "./TransactionTable";

const Wallet = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="wallet-gradient w-full rounded-2xl p-4">
        <p className="text-[#ffffff] text-[13px]">Available Balance</p>
        <p className="text-[36px] text-[#ffffff] font-semibold">$1059.86</p>
        <div className="w-full flex items-center">
          <button
            type="submit"
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
          <div className="p-4 bg-[#fff] px-10">All</div>
        </div>
        <div className="w-full mt-2">
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
};

export default Wallet;
