import { useState } from "react";
import { unToggled, toggled } from "../../assets/export";

const NOTIFICATION_PREFS = [
  {
    key: "bookingCanceled",
    title: "Booking Canceled:",
    description: "Receive an alert when a booking is canceled.",
  },
  {
    key: "newBooking",
    title: "New Booking Alert:",
    description: "Get notified when someone books your Crash Pad.",
  },
];

const NotificationsSetting = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    bookingCanceled: false,
    newBooking: false,
  });

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-custom-sm flex flex-col items-center p-4">
      <div className="flex flex-col gap-6 w-full pt-4 px-2">
        {NOTIFICATION_PREFS.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between w-full  pb-4"
          >
            <div className="w-[250px]">
              <p className="text-[14px] text-[#000000] font-semibold">
                {item.title}
              </p>
              <p className="text-[#18181899] text-[13px]">{item.description}</p>
            </div>

            {/* Toggle */}
            <div
              className="cursor-pointer"
              onClick={() => handleToggle(item.key)}
            >
              <input
                type="checkbox"
                checked={toggles[item.key]}
                onChange={() => handleToggle(item.key)}
                className="hidden"
              />
              <img
                src={toggles[item.key] ? unToggled : toggled}
                alt={toggles[item.key] ? "Checked" : "Unchecked"}
                className="w-12 h-10 transition-transform duration-200 ease-in-out"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsSetting;
