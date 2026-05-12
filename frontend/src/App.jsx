import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RepositoryPage from "./pages/RepositoryPage";

import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/repository/:id"
          element={
            <PrivateRoute>
              <RepositoryPage />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;