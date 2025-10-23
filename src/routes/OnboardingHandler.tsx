import { Navigate, Outlet } from "react-router";

export const OnboardingHandler = ({
  token,
  isSubscription,
}: {
  token: string | null;
  isSubscription: boolean | unknown;
}) => {
  console.log("🚀 ~ OnboardingHandler ~ isSubscription:", isSubscription);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isSubscription) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
