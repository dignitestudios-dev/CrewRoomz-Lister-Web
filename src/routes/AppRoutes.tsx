import Booking from "../pages/app/Booking";
import BookingDetails from "../pages/app/BookingDetails";
import BookingHistory from "../pages/app/BookingHistory";
import Chat from "../pages/app/Chat";
import ConnectStripeAccount from "../pages/app/ConnectStripeAccount";
import Home from "../pages/app/Home";
import ListingCreate from "../pages/app/ListingCreate";
import Notification from "../pages/app/Notification";
import PropertyAdd from "../pages/app/PropertyAdd";
import PropertyDetails from "../pages/app/PropertyDetails";
import PropertyEdit from "../pages/app/PropertyEdit";
import Settings from "../pages/app/Settings";
import Verif from "../pages/auth/Verif";

export const AppRoutes = [
  {
    url: "verif",
    page: <Verif />,
    isPublic: true,
  },
  {
    url: "connect-account",
    page: <ConnectStripeAccount />,
    isPublic: true,
  },
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
    url: "edit-property/:id",
    page: <PropertyEdit />,
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
    url: "chat/:userId?",
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
