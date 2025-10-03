import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthRoute } from "./routes/AuthRoutes";
import { onboardRoute } from "./routes/OnboardingRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {AppRoutes.map((route, idx) => (
          <Route key={idx} path={route.url} element={route.page} />
        ))}
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route
          path="*"
          element={<div className="text-7xl">Page Not Found</div>}
        />
      </Route>
      <Route path="/">
        {AuthRoute.map((route, idx) => (
          <Route key={idx} path={route.url} element={route.page} />
        ))}
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route
          path="*"
          element={<div className="text-7xl">Page Not Found</div>}
        />
      </Route>
      <Route path="/">
        {onboardRoute.map((route, idx) => (
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
