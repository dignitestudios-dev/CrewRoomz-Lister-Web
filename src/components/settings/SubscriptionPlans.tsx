import React from "react";

const SubscriptionPlans = () => {
  return (
    <div className="bg-white p-6 rounded-2xl mb-4">
      <div className="flex items-center justify-center w-full">
        <p className="text-[24px] text-[#181818] font-semibold mb-4">
          SubscriptionPlans
        </p>
      </div>
      <div className="flex items-center justify-between w-full gap-6">
        <div className="bg-white shadow-lite rounded-xl p-4 space-y-4">
          <div className="flex justify-end w-full">
            <p className="text-[32px] font-semibold text-[#36C0EF]">
              $2.99<span className="text-[14px] text-gray-500">/7days</span>
            </p>
          </div>
          <div>
            <p className="gradient-text">Package 1</p>
          </div>
          <div>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                quis interdum purus, eu placerat eros.
              </li>
              <li>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                quis interdum purus, eu placerat eros.
              </li>
              <li>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                quis interdum purus, eu placerat eros.
              </li>
            </ul>
          </div>
          <div className="w-full">
            <button
              type="button"
              className="w-full my-6 rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
        <div className="bg-white shadow-lite rounded-xl p-4 space-y-4">
          <div className="flex justify-end w-full">
            <p className="text-[32px] font-semibold text-[#36C0EF]">
              $2.99<span className="text-[14px] text-gray-500">/7days</span>
            </p>
          </div>
          <div>
            <p className="gradient-text">Package 1</p>
          </div>
          <div>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                quis interdum purus, eu placerat eros.
              </li>
              <li>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                quis interdum purus, eu placerat eros.
              </li>
              <li>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                quis interdum purus, eu placerat eros.
              </li>
            </ul>
          </div>
          <div className="w-full">
            <button
              type="button"
              className="w-full my-6 rounded-[8px] gradient-color text-white text-[16px] py-3 px-6 font-medium"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
