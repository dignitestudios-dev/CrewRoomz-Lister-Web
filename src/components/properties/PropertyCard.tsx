import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { LuMapPin } from "react-icons/lu";
import ConfirmationModal from "../global/ConfirmationModal";
import { bgChecked } from "../../assets/export";

interface Property {
  _id: string | number; // allow both
  name: string;
  rent: number;
  address: string;
  beds?: string[];
  image: string;
  status?: string;
  author?: string;
}

interface PropertyCardProps {
  property: Property;
  dotBar: string; // image for the dot menu
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, dotBar }) => {
  const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleOptionSelect = (action: string) => {
    console.log(`Action on ${property.name}:`, action);
    setIsOptionDropdownOpen(false);
    // You can later expand: call API, open modal, etc.
  };

  return (
    <div
      ref={cardRef}
      className="bg-white p-3 rounded-3xl shadow-lg overflow-hidden"
    >
      {/* Property Image */}
      <div className="relative">
        <img
          src={property.image}
          alt="Property"
          className="w-full h-[13em] object-cover rounded-xl"
        />
        <div className="absolute top-3 left-2 px-2 py-1 text-white text-[12px] rounded-full bg-green-500">
          {property.status || "Active"}
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
              onClick={() => navigate("/add-property")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-tl-lg"
            >
              Edit
            </button>
            <button
              onClick={() => setIsDelete(true)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Delete
            </button>
            <button
              onClick={() => handleOptionSelect("deactivate")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-b-lg"
            >
              Deactivate
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex justify-between items-center text-[16px] font-[600]">
          <span
            className="cursor-pointer"
            onClick={() => navigate(`/property-details/${property._id}`)}
          >
            {property.name}
          </span>
          <p className="mt-2 text-[#0151DA]">${property.rent}</p>
        </div>

        <div className="flex gap-1 items-start">
          <LuMapPin size={16} className="mt-0.5 text-gray-500" />
          <p className="text-gray-500 font-[400] text-[14px]">
            {property.address}
          </p>
        </div>

        <span className="text-sm text-black">{property.beds?.join(" , ")}</span>
      </div>
      {isDelete && (
        <ConfirmationModal
          title="Delete Listing"
          content="Are you sure you want to delete this listing?"
          skipBtnContent="No"
          confirmBtnContent="Delete"
          onClose={() => setIsDelete(false)}
          onSubmit={() => {
            setIsDelete(false);
            setDeleteSuccess(true);
          }}
        />
      )}
      {deleteSuccess && (
        <div className="fixed inset-0 bg-[#04080680] bg-opacity-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setDeleteSuccess(false)}
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
