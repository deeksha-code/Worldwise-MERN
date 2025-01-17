import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import { AuthProvider } from "./contexts/FakeAuthContext";
import { CitiesProvider } from "./contexts/CitiesContext";
import ProtectedRoutes from "./pages/ProtectedRoutes";

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Product = lazy(() => import("./pages/Product"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CitiesProvider>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              {/* Public routes */}
              <Route index element={<HomePage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token/" element={<ResetPassword />} />
              <Route path="/verify-email/:token/" element={<VerifyEmail />} />

              {/* Protected routes */}
              <Route
                path="app"
                element={
                  <ProtectedRoutes>
                    <AppLayout />
                  </ProtectedRoutes>
                }
              >
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </CitiesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
