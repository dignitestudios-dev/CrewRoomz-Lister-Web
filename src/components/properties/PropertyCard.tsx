import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { LuMapPin } from "react-icons/lu";
import ConfirmationModal from "../global/ConfirmationModal";
import { bgChecked } from "../../assets/export";
import { FaStar } from "react-icons/fa6";
import axios from "../../axios";
import { useToast } from "../../hooks/useToast";
import Toast from "../global/Toast";
import { getErrorMessage } from "../../init/appValues";

interface Property {
  _id: string | number; // allow both
  city: string;
  state: string;
  rent: number;
  address: string;
  bedDetails?: BedDetail[];
  media: string[];
  roomStatus?: string;
  author?: string;
  averageRating: number;
}

interface BedDetail {
  type: string;
  price: number;
  monthlyPrice: number;
  _id: string;
}

interface PropertyCardProps {
  room: Property;
  dotBar: string;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  room,
  dotBar,
  setUpdate,
}) => {
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [isDeactivate, setISDeactivate] = useState(false);

  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const { toast, showToast } = useToast();
  const [componentState, setComponentState] = useState<LoadState>("idle");

  const handleOptionSelect = (action: string) => {
    if (action === "delete") {
      setIsDelete(true);
    } else if (action === "deactivate") {
      setISDeactivate(true);
    }
    setIsOptionDropdownOpen(false);
    // You can later expand: call API, open modal, etc.
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsOptionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    try {
      setComponentState("loading");
      const response = await axios.delete(`/rooms/${room._id}`);
      if (response.status === 200) {
        setComponentState("ready");
        setIsDelete(false);
        setDeleteSuccess(true);
      }
    } catch (error) {
      setComponentState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  const handleDeactivate = async () => {
    try {
      setComponentState("loading");
      const response = await axios.put(`/rooms/toggleRoomStatus/${room._id}`);
      if (response.status === 200) {
        setComponentState("ready");
        setISDeactivate(false);
        setUpdate((prev) => !prev);
      }
    } catch (error) {
      setComponentState("error");
      showToast(getErrorMessage(error), "error");
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white p-3 rounded-3xl shadow-lg overflow-hidden"
    >
      {(componentState === "error" || componentState === "ready") && (
        <Toast {...toast} />
      )}
      {/* room Image */}
      <div className="relative">
        {room.media[0].endsWith(".mp4") ? (
          <video
            src={room.media[0]}
            className="w-full h-[13em] object-cover rounded-xl"
            autoPlay
            loop
            muted
          />
        ) : (
          <img
            src={room?.media[0]}
            alt="room"
            className="w-full h-[13em] object-cover rounded-xl"
          />
        )}

        <div className="absolute top-3 left-2 px-2 py-1 text-white text-[12px] rounded-full bg-green-500 capitalize">
          {room.roomStatus}
        </div>
        <div
          onClick={() => setIsOptionDropdownOpen((prev) => !prev)}
          className="absolute top-3 right-3 px-1 py-1 cursor-pointer"
        >
          <img src={dotBar} alt="Status" className="h-6 w-6" />
        </div>

        {isOptionDropdownOpen && (
          <div className="absolute w-[150px] top-11 right-4 text-[15px] font[400] bg-white rounded-l-lg rounded-b-lg shadow-lg z-10">
            <button
              onClick={() =>
                navigate(`/edit-property/${room?._id}`, { state: { room } })
              }
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-tl-lg"
            >
              Edit
            </button>
            <button
              onClick={() => handleOptionSelect("delete")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Delete
            </button>
            <button
              onClick={() => handleOptionSelect("deactivate")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-b-lg"
            >
              {room.roomStatus === "active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex justify-between items-center text-[16px] font-[600]">
          <span
            className="cursor-pointer"
            onClick={() => navigate(`/property-details/${room._id}`)}
          >
            {room?.state}, {room?.city}
          </span>
          <div className="flex items-center gap-2 mb-2">
            <FaStar className="text-yellow-400 text-lg" />{" "}
            <p>{room?.averageRating}</p>
          </div>
        </div>

        <div className="flex gap-1 items-start">
          <LuMapPin size={16} className="mt-0.5 text-gray-500" />
          <p className="text-gray-500 font-[400] text-[14px]">{room.address}</p>
        </div>

        <span className="text-sm text-black">
          {" "}
          {room.bedDetails?.map((item) => item.type)?.join(", ")}
        </span>
      </div>
      {isDelete && (
        <ConfirmationModal
          title="Delete Listing"
          content="Are you sure you want to delete this listing?"
          skipBtnContent="No"
          confirmBtnContent="Delete"
          onClose={() => setIsDelete(false)}
          onSubmit={handleDelete}
          loading={componentState}
        />
      )}
      {isDeactivate && (
        <ConfirmationModal
          title={
            room.roomStatus === "active"
              ? "Deactivate Listing"
              : "Activate Listing"
          }
          content={
            room.roomStatus === "active"
              ? "Are you sure you want to deactivate this listing?"
              : "Are you sure you want to activate this listing?"
          }
          skipBtnContent="No"
          confirmBtnContent={
            room.roomStatus === "active" ? "Deactivate" : "Activate"
          }
          onClose={() => setISDeactivate(false)}
          onSubmit={handleDeactivate}
          loading={componentState}
        />
      )}
      {deleteSuccess && (
        <div className="fixed inset-0 bg-[#04080680] bg-opacity-0 z-50 flex items-center justify-center">
          <div
            onClick={() => {
              setDeleteSuccess(false);
              setUpdate((prev) => !prev);
            }}
            className="bg-white rounded-2xl p-6 w-[400px] text-center shadow-lg  flex flex-col justify-center items-center relative"
          >
            <div className="absolute -top-10">
              <img src={bgChecked} alt="abc" className="w-20 h-20" />
            </div>
            <p className="text-[20px] text-[#181818] font-semibold mt-8 mb-2">
              Listing Deleted!
            </p>
            <p className="text-[15px] text-[#18181899] my-2">
              The listing has been successfully deleted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
