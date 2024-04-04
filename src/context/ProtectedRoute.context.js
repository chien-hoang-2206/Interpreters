import React, { useContext } from "react";
import NotAdmin from "../pages/NotFound/NotAdmin";
import { AuthContext } from "./auth.context";
import Login from "../pages/Login";

export function ProtectedRoute({ Component, role }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Login />;
  }
  if (role === "ADMIN") {
    if (user.role_id === 3) {
      return <Component />;
    } else return <NotAdmin />;
  } else return <Component />;
}
