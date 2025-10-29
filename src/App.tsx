import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthRoute } from "./routes/AuthRoutes";
import { onboardRoute } from "./routes/OnboardingRoutes";
import useAuthStore from "./store/authStore";
import PublicRoute from "./routes/PublicRoutes";
import { OnboardingHandler } from "./routes/OnboardingHandler";
import { useNotificationStore } from "./store/useNotificationStore";
import { useEffect, useState } from "react";
import { requestNotificationPermission } from "./firebase/messages";

function App() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [, setFcmToke] = useState<string>();

  const initListener = useNotificationStore((s) => s.initForegroundListener);

  useEffect(() => {
    // Request permission
    requestNotificationPermission().then((token) => {
      if (token) {
        setFcmToke(token);
      }
    });

    // Start foreground listener
    const cleanup = initListener();

    return cleanup; // Cleanup on unmount
  }, [initListener]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute token={token} identityStatus={user?.identityStatus} />
        }
      >
        {AuthRoute.map((route, idx) => (
          <Route key={idx} path={route.url} element={route.page} />
        ))}
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route
          path="*"
          element={<div className="text-7xl">Page Not Found</div>}
        />
      </Route>

      <Route
        path="/"
        element={
          <OnboardingHandler
            token={token}
            isSubscription={user?.isSubscription}
          />
        }
      >
        {onboardRoute.map((route, idx) => (
          <Route key={idx} path={route.url} element={route.page} />
        ))}
        <Route path="/" element={<Navigate to="connect-account" replace />} />
        <Route
          path="*"
          element={<div className="text-7xl">Page Not Found</div>}
        />
      </Route>

      <Route
        path="/"
        element={
          <AppLayout token={token} identityStatus={user?.identityStatus} />
        }
      >
        {AppRoutes.map((route, idx) => (
          <Route key={idx} path={route.url} element={route.page} />
        ))}
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route
          path="*"
          element={<div className="text-7xl">Page Not Found</div>}
        />
      </Route>
    </Routes>
  );
}

export default App;
