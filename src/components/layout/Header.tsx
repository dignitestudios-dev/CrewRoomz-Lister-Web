import { NavLink, useNavigate } from "react-router";
import { logo, logout, setting } from "../../assets/export.ts";
import { headerOptions } from "../../statics/headerOptions.tsx";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import useAuthStore from "../../store/authStore.ts";
import { useAppStore } from "../../store/appStore.ts";
import axios from "../../axios.ts";
import Toast from "../global/Toast.tsx";
import { useToast } from "../../hooks/useToast.ts";
import { getDateFormat, getErrorMessage } from "../../init/appValues.ts";

interface notificationsData {
  _id: string | number; // allow both
  createdAt: Date;
  description: string;
  title: string;
}

const Header = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const { user } = useAppStore();

  const userPopupRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const [userPopup, setUserPopup] = useState<boolean>(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const { toast, showToast } = useToast();

  const [state, setState] = useState<LoadState>("idle");

  const [notificationData, setNotificationData] = useState<notificationsData[]>(
    []
  );
  const [pagination, setPagination] = useState({
    itemsPerPage: 15,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  });
  console.log("🚀 ~ Header ~ notificationData:", notificationData);

  const toggleUserPopup = () => {
    setUserPopup(!userPopup);
  };

  const fetchNotifications = async (page = 1) => {
    try {
      setState("loading");

      // Include both limit & page in your request
      const { data } = await axios.get(`/notifications?limit=5&page=${page}`);

      console.log("🚀 ~ notification ~ data:", data);

      if (data?.success) {
        setState("ready");

        // Append or replace notifications based on the page
        if (page > 1) {
          setNotificationData((prev) => [...prev, ...data.data]);
        } else {
          setNotificationData(data.data);
        }

        // Update pagination
        setPagination(data.pagination);
      }
    } catch (error) {
      setState("error");
      showToast(getErrorMessage(error), "error");
      console.log("🚀 ~ notification ~ error:", error);
    }
  };

  useEffect(() => {
    if (isNotificationDropdownOpen) {
      fetchNotifications(1);
    }
  }, [isNotificationDropdownOpen]);

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
      {state === "error" && <Toast {...toast} />}
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
            className="absolute top-[4em] right-64 w-[400px] max-h-[470px] overflow-y-auto mt-2 bg-white shadow-lg rounded-xl border border-gray-200 p-3 z-50"
          >
            <div className="flex justify-center my-2">
              <p className="text-[22px] font-semibold mb-2">Notifications</p>
            </div>

            {/* Notification list */}
            {state === "loading" && notificationData.length === 0 ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : notificationData.length === 0 ? (
              <p className="text-center text-gray-500">No notification found</p>
            ) : (
              notificationData.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mt-2 p-2 border-b border-gray-100"
                >
                  <div>
                    <p className="text-[16px] font-semibold">{item.title}</p>
                    <p className="text-[14px] text-[#666666]">
                      {item.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-[14px] text-[#8C8C8C]">
                      {getDateFormat(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Load more button */}
            {pagination.currentPage < pagination.totalPages && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => fetchNotifications(pagination.currentPage + 1)}
                  disabled={
                    state === "loading" ||
                    pagination.currentPage >= pagination.totalPages
                  }
                  className={`text-blue-600 font-semibold hover:underline ${
                    state === "loading" ||
                    pagination.currentPage >= pagination.totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {state === "loading"
                    ? "Loading..."
                    : pagination.currentPage >= pagination.totalPages
                    ? "No more notifications"
                    : "Load More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
