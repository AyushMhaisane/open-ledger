import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddProperty from "./pages/AddProperty";

import { AuthProvider, useAuth } from "./context/AuthContext";

/* -------------------------
   Shared Loader
-------------------------- */
function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );
}

/* -------------------------
   Protected Route
   (Only for logged-in users)
-------------------------- */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/* -------------------------
   Public Route
   (Login / Signup only)
-------------------------- */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/* -------------------------
   App
-------------------------- */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<Landing />} />

          {/* Auth routes (blocked when logged in) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/properties/new"
            element={
              <ProtectedRoute>
                <AddProperty />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
