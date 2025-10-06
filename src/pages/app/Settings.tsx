import { SETTINGS_OPTIONS } from "../../statics/settingsOptions";

import ProfileEdit from "../../components/settings/ProfileEdit";
import { useMemo, useState } from "react";
import Wallet from "../../components/settings/Wallet";
import SubscriptionPlans from "../../components/settings/SubscriptionPlans";
import TermsAndConditions from "../../components/settings/TermsAndConditions";
import PrivacyPolicy from "../../components/settings/PrivacyPolicy";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
import NotificationsSetting from "../../components/settings/NotificationsSetting";
import ChangePassword from "../../components/settings/ChangePassword";
import DeleteAccount from "../../components/settings/DeleteAccount";

const Settings = () => {
  const defaultKey = useMemo(
    () =>
      SETTINGS_OPTIONS.find((o) => o.active)?.key ??
      SETTINGS_OPTIONS[0]?.key ??
      "",
    []
  );
  const [keyValue, setKeyValue] = useState<string>(defaultKey);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="grid grid-cols-3 pt-16 px-24 gap-16">
      <div className="w-[440px] mx-auto pt-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-custom-sm">
          {SETTINGS_OPTIONS.map((opt) => (
            <div key={opt.key}>
              <button
                type="button"
                onClick={() => {
                  if (opt.key === "settings") {
                    setExpanded(!expanded); // toggle children
                  } else {
                    setKeyValue(opt.key);
                  }
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 text-left border-b border-[#E3DBDB] last:border-b-0 ${
                  keyValue === opt.key ? "bg-[#F0FAFF]" : ""
                }`}
              >
                <img src={opt.icon} alt={opt.label} className="h-8 w-8" />
                <p className="text-[16px] font-medium text-[#111827]">
                  {opt.label}
                </p>

                {opt.children && (
                  <span className="ml-auto text-gray-400">
                    {expanded ? <HiChevronDown /> : <HiChevronRight />}
                  </span>
                )}
              </button>

              {/* Render children if expanded */}
              {opt.children && expanded && (
                <div className=" flex flex-col">
                  {opt.children.map((child) => (
                    <button
                      key={child.key}
                      onClick={() => setKeyValue(child.key)}
                      className={`pl-10 text-left px-4 py-2 text-sm rounded-md flex items-center gap-4 ${
                        keyValue === child.key
                          ? "bg-[#F0FAFF] text-[#36C0EF]"
                          : "text-gray-600 hover:text-[#36C0EF] hover:bg-[#F0FAFF] "
                      }`}
                    >
                      <img
                        src={child.icon}
                        alt={child.label}
                        className="h-6 w-6"
                      />

                      <p>{child.label}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-[700px] mx-auto pt-8">
        {keyValue === "profile" && <ProfileEdit />}
        {keyValue === "wallet" && (
          <div className=" rounded-2xl">
            <Wallet />
          </div>
        )}
        {keyValue === "subscription" && <SubscriptionPlans />}

        {keyValue === "notifications" && <NotificationsSetting />}
        {keyValue === "change-password" && <ChangePassword />}
        {keyValue === "delete-account" && <DeleteAccount />}
        {keyValue === "terms" && <TermsAndConditions />}
        {keyValue === "privacy" && <PrivacyPolicy />}
      </div>
    </div>
  );
};

export default Settings;
