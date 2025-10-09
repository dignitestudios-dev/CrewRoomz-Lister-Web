import { NavLink, useNavigate } from "react-router";
import { logo, logout, setting } from "../../assets/export.ts";
import { headerOptions } from "../../statics/headerOptions.tsx";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import useAuthStore from "../../store/authStore.ts";
import { useAppStore } from "../../store/appStore.ts";

const Header = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const { user } = useAppStore();

  const userPopupRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const [userPopup, setUserPopup] = useState<boolean>(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  const toggleUserPopup = () => {
    setUserPopup(!userPopup);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(e.target as Node)
      ) {
        setUserPopup(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#FFFFFF] flex justify-between items-center rounded-b-3xl px-[6em] py-4">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} className="h-[4.4em] w-auto" alt="Company Logo" />
      </div>

      {/* header and User Section */}
      <div className="flex items-center gap-6">
        {headerOptions.map((item: HeaderOption, index: number) => (
          <div
            key={index}
            className="text-start pt-2 py-2 text-[16px] text-nowrap "
          >
            {item.path === "notification" ? (
              <button
                type="button"
                onClick={() => setIsNotificationDropdownOpen((prev) => !prev)}
                className="block px-2 py-1 transition text-black hover:text-[#29ABE2]"
              >
                {item.label}
              </button>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-2 py-1 transition ${
                    isActive
                      ? "gradient-text border-b-2 border-b-[#29ABE2]"
                      : "text-black"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )}
          </div>
        ))}
        <div>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={toggleUserPopup}
          >
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                src={user?.profilePicture}
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-black">{user?.name}</p>
            <MdKeyboardArrowDown className="text-black text-lg" />
          </div>
          {userPopup && (
            <div
              className="absolute top-[6em] right-20 w-[353px] p-4 bg-white shadow-lg rounded-lg border border-slate-200 z-50"
              ref={userPopupRef}
            >
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full overflow-hidden mb-3">
                  <img
                    src={user?.profilePicture}
                    alt="User Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-black text-[20px] font-[600]">
                  {user?.name}
                </p>
                <p className="text-gray-600 text-[13px] font-medium">
                  {user?.email}
                </p>
              </div>
              <div className="space-y-3 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("settings")}
                  className="w-full flex items-center gap-2 text-left px-1 py-1 cursor-pointer hover:text-blue-500"
                >
                  <img
                    src={setting}
                    alt={"it.label"}
                    className="h-6 w-6 object-cover"
                  />
                  <span className="text-[14px] font-[500]">Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    clearAuth();
                    navigate("login");
                  }}
                  className="w-full flex items-center gap-2 text-left px-1 py-1 cursor-pointer hover:text-blue-500"
                >
                  <img
                    src={logout}
                    alt={"it.label"}
                    className="h-6 w-6 object-cover"
                  />
                  <span className="text-[14px] font-[500]">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
        {isNotificationDropdownOpen && (
          <div
            ref={notificationRef}
            className="absolute top-[4em] right-64 w-[400px] mt-2 bg-white shadow-lg rounded-xl border border-gray-200 p-3 z-50"
          >
            <div className="flex justify-center my-2 ">
              <p className="text-[22px] font-semibold mb-2">Notifications</p>
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between items-center mt-2 p-2"
              >
                <div>
                  <p className="text-[16px] font-semibold">
                    Notification title
                  </p>
                  <p className="text-[14px] text-[#666666]">
                    Notification detail goes here
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[#8C8C8C]">1min ago</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
