import React, { useState } from "react";
import axios from "../../axios";
import toast from "react-hot-toast";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  getBookings: () => void;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  getBookings,
}) => {
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null; // Don't render when closed

  const handleBookingStatus = async () => {
    if (!cancelReason.trim()) {
      toast.error("Cancellation reason is required");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        bookingId,
        cancellationReason: cancelReason,
        additionalDetails: cancelDescription,
      };

      const response = await axios.post("/booking/cancelBooking", payload);

      if (response.status === 200) {
        toast.success("Booking cancelled successfully");
        getBookings();
        onClose();
      }
    } catch (error) {
      console.log("🚀 ~ handleBookingStatus ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="modal-bg p-6 rounded-2xl shadow-xl w-full max-w-[500px]"
        onClick={(e) => e.stopPropagation()} // prevent closing on modal click
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold ">Cancel Booking</h2>
          <button
            onClick={onClose}
            type="button"
            className="cursor-pointer hover:bg-gray-50 rounded-full"
          >
            X
          </button>
        </div>
        <p className="text-[#000000] text-[14px] font-light">
          Please Provide a reason for cancellation
        </p>

        <div className="flex flex-col gap-3">
          <div className="pt-2">
            <label className="text-sm font-light text-[#000000]">
              Cancellation Reason
            </label>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason for cancellation"
              className="w-full px-2 py-4 mt-1 bg-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[13px] placeholder:pl-3"
            />
          </div>

          <div>
            <label className="text-sm font-light text-[#000000]">
              Additional Details
            </label>
            <textarea
              value={cancelDescription}
              onChange={(e) => setCancelDescription(e.target.value)}
              placeholder="Write here"
              rows={5}
              className="w-full px-2 py-4 mt-1 bg-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[13px] placeholder:pl-3"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={handleBookingStatus}
            disabled={isLoading}
            className="cursor-pointer w-full rounded-[8px] gradient-color text-white text-[14px] py-3 px-6 font-medium"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
