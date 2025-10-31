interface BedDetail {
  _id: string;
  type: string;
  price: number; // daily price
  monthlyPrice: number;
  roomName: string;
}

interface Props {
  bedDetails: BedDetail[];
}

const BedPricing: React.FC<Props> = ({ bedDetails }) => {
  return (
    <div className="bg-[#FFFFFF] p-4 rounded-3xl">
      <h2 className="text-[20px] font-[500] mb-4">Prices</h2>

      {bedDetails && bedDetails.length > 0 ? (
        bedDetails.map((bed) => (
          <div key={bed._id} className="mb-4">
            <p className="font-semibold text-[16px]">
              {" "}
              Room Name: <span className="font-[500]">{bed.roomName}</span>
            </p>
            <p className="text-[16px] font-[500] capitalize">
              {bed.type.replace("-", " ")}
            </p>

            <div className="flex items-center gap-2 mt-2">
              {/* Daily Price */}
              <div className="border border-blue-400 rounded-xl w-[200px] py-1">
                <p className="text-[14px] px-3">Daily</p>
                <p className="text-[14px] text-blue-400 px-3">
                  ${bed.price ?? "N/A"}
                </p>
              </div>

              {/* Monthly Price */}
              <div className="border border-blue-400 rounded-xl w-[200px] py-1">
                <p className="text-[14px] px-3">Monthly</p>
                <p className="text-[14px] text-blue-400 px-3">
                  ${bed.monthlyPrice ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">
          No bed pricing details available.
        </p>
      )}
    </div>
  );
};

export default BedPricing;
