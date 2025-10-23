import React from "react";
import { RxCross2 } from "react-icons/rx";

interface InvoiceProps {
  onClose: () => void;
  invoiceData: {
    amount: number;
    referenceId: string;
    name: string;
    date: string;
    type: string;
    description: string;
  };
}

const WithdrawalInvoiceModal: React.FC<InvoiceProps> = ({
  onClose,
  invoiceData,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[26em] text-center shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <RxCross2 size={24} />
        </button>
        <div className="flex justify-center items-center mb-4">
          <div className="bg-[#36C0EF] rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-[20px] font-semibold mb-4">
          Withdraw Successfully!
        </h2>
        <div className="text-left space-y-4">
          <p className="text-[14px] font-medium">
            <span className="text-gray-500">Amount Withdraw:</span>{" "}
            <span className="text-[#36C0EF] font-semibold">
              USD ${invoiceData.amount}
            </span>
          </p>
          <p className="text-[14px] font-medium">
            <span className="text-gray-500">Reference ID:</span>{" "}
            {invoiceData.referenceId}
          </p>
          <p className="text-[14px] font-medium">
            <span className="text-gray-500">Name:</span> {invoiceData.name}
          </p>
          <p className="text-[14px] font-medium">
            <span className="text-gray-500">Date:</span> {invoiceData.date}
          </p>
          <p className="text-[14px] font-medium">
            <span className="text-gray-500">Type:</span> {invoiceData.type}
          </p>
          <p className="text-[14px] font-medium">
            <span className="text-gray-500">Description:</span>{" "}
            {invoiceData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalInvoiceModal;
