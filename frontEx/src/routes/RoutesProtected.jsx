import { Navigate, Outlet } from "react-router-dom";

const RoutesProtected = ({ tokenAdmin, rolTypeAdmin }) => {
  console.log(rolTypeAdmin);
  return tokenAdmin && rolTypeAdmin === "administrador" ? (
    <Outlet />
  ) : (
    <Navigate to="/administrador" />
  );
};

export default RoutesProtected;
