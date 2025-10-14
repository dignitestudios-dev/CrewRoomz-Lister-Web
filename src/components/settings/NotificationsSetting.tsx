import { useState } from "react";
import { unToggled, toggled } from "../../assets/export";
import { useToast } from "../../hooks/useToast";
import axios from "../../axios";
import { getErrorMessage } from "../../init/appValues";
import Toast from "../global/Toast";

const NOTIFICATION_PREFS = [
  {
    key: "off",
    title: "Notifications alert:",
    description: "Receive alerts.",
  },
  // {
  //   key: "newBooking",
  //   title: "New Booking Alert:",
  //   description: "Get notified when someone books your Crash Pad.",
  // },
];

const NotificationsSetting = () => {
  const { toast, showToast } = useToast();

  const [state, setState] = useState<LoadState>("idle");
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    off: false,
  });

  const handleToggle = async (key: string) => {
    const newValue = !toggles[key];
    setToggles((prev) => ({ ...prev, [key]: newValue }));

    // prepare payload
    const payload = {
      notification: newValue,
    };

    try {
      setState("loading");

      const response = await axios.put("/settings", payload);

      if (response.status === 200) {
        setState("ready");
        showToast(
          newValue
            ? "Notifications enabled successfully!"
            : "Notifications turned off!",
          "success"
        );
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");

      // revert state if request fails
      setToggles((prev) => ({ ...prev, [key]: !newValue }));
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-custom-sm flex flex-col items-center p-4">
      {(state === "error" || state === "ready") && <Toast {...toast} />}
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
              className={`cursor-pointer ${
                state === "loading" ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => handleToggle(item.key)}
            >
              {state === "loading" ? (
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <img
                  src={toggles[item.key] ? `${toggled}` : `${unToggled}`}
                  alt={toggles[item.key] ? "Checked" : "Unchecked"}
                  className="w-12 h-10 transition-transform duration-200 ease-in-out"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsSetting;
