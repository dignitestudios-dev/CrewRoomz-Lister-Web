import React from "react";
import { FaStar } from "react-icons/fa";
import { user } from "../../assets/export";

type Breakdown = Record<number, number>;

interface ReviewProps {
  breakdown: Breakdown;
  onClose?: () => void;
}

const PropertyReviewModal: React.FC<ReviewProps> = ({ breakdown, onClose }) => {
  const stars = [5, 4, 3, 2, 1];
  const total = stars.reduce((sum, s) => sum + (breakdown[s] || 0), 0);
  const average = total
    ? stars.reduce((acc, s) => acc + s * (breakdown[s] || 0), 0) / total
    : 0;

  return (
    <div className="fixed inset-0 bg-[#04080680] bg-opacity-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[28em] h-[580px] text-center shadow-lg relative">
        <div className="flex items-center justify-between mb-4 mt-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-semibold">
              {average ? average.toFixed(1) : "0.0"}
            </div>
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`${
                    average >= i + 1
                      ? "opacity-100"
                      : average >= i + 0.5
                      ? "opacity-80"
                      : "opacity-30"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500">{total} reviews</div>
        </div>

        {stars.map((s) => {
          const count = breakdown[s] || 0;
          const pct = total ? (count / total) * 100 : 0;
          return (
            <div key={s} className="flex items-center gap-3 mb-2">
              <div className="w-20 text-sm">
                {s} star{s > 1 ? "s" : ""}
              </div>

              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-color"
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>

              <div className="w-10 text-sm text-right">{count}</div>
            </div>
          );
        })}
        <div className="mt-4 overflow-y-auto max-h-72 text-left">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`${
                  average >= i + 1
                    ? "opacity-100"
                    : average >= i + 0.5
                    ? "opacity-80"
                    : "opacity-30"
                }`}
              />
            ))}
          </div>
          <div>
            <p className="text-[14px]  font-[400] text-justify mt-2">
              Amazing product. I booked on Monday and I got my order on the next
              day. I’m highly impressed with their services. Highly recommended!
            </p>
            <div className="flex justify-start items-center gap-2">
              <img
                src={user}
                alt="user"
                className="h-8 w-8 rounded-full mt-2"
              />
              <div className="mt-2 ml-2">
                <p className="font-[500]">Abc Xyz</p>
              </div>
            </div>
          </div>
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`${
                  average >= i + 1
                    ? "opacity-100"
                    : average >= i + 0.5
                    ? "opacity-80"
                    : "opacity-30"
                }`}
              />
            ))}
          </div>
          <div>
            <p className="text-[14px]  font-[400] text-justify mt-2">
              Amazing product. I booked on Monday and I got my order on the next
              day. I’m highly impressed with their services. Highly recommended!
            </p>
            <div className="flex justify-start items-center gap-2">
              <img
                src={user}
                alt="user"
                className="h-8 w-8 rounded-full mt-2"
              />
              <div className="mt-2 ml-2">
                <p className="font-[500]">Abc Xyz</p>
              </div>
            </div>
          </div>
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`${
                  average >= i + 1
                    ? "opacity-100"
                    : average >= i + 0.5
                    ? "opacity-80"
                    : "opacity-30"
                }`}
              />
            ))}
          </div>
          <div>
            <p className="text-[14px]  font-[400] text-justify mt-2">
              Amazing product. I booked on Monday and I got my order on the next
              day. I’m highly impressed with their services. Highly recommended!
            </p>
            <div className="flex justify-start items-center gap-2">
              <img
                src={user}
                alt="user"
                className="h-8 w-8 rounded-full mt-2"
              />
              <div className="mt-2 ml-2">
                <p className="font-[500]">Abc Xyz</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" border-t border-t-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="mt-1 px-4 py-2 bg-transparent text-black text-sm border-[1px] border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyReviewModal;
