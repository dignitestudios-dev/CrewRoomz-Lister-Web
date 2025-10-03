import Booking from "../pages/Booking";
import BookingDetails from "../pages/BookingDetails";
import BookingHistory from "../pages/BookingHistory";
import Chat from "../pages/Chat";
import Home from "../pages/Home";
import ListingCreate from "../pages/ListingCreate";
import Notification from "../pages/Notification";
import PropertyAdd from "../pages/PropertyAdd";
import PropertyDetails from "../pages/PropertyDetails";
import Settings from "../pages/Settings";

export const AppRoutes = [
  {
    url: "home",
    page: <Home />,
  },
  {
    url: "add-listing",
    page: <ListingCreate />,
  },
  {
    url: "add-property",
    page: <PropertyAdd />,
  },
  {
    url: "property-details/:id",
    page: <PropertyDetails />,
  },
  {
    url: "booking",
    page: <Booking />,
  },
  {
    url: "booking-history",
    page: <BookingHistory />,
  },
  {
    url: "booking-details/:id",
    page: <BookingDetails />,
  },
  {
    url: "chat",
    page: <Chat />,
  },
  {
    url: "notification",
    page: <Notification />,
  },
  {
    url: "settings",
    page: <Settings />,
  },
];
