import { PiBellThin } from "react-icons/pi";

export const headerOptions = [
  { label: "Home", path: "home" },
  { label: "Bookings", path: "booking" },
  { label: "Booking History", path: "booking-history" },
  { label: "Chat", path: "chat" },
  {
    label: <PiBellThin className="text-2xl " />,
    path: "notification",
  },
];
