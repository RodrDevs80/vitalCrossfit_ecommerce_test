import { Navigate, Outlet } from "react-router-dom";

const RoutesProtectedUserCliente = ({ tokenCliente, rolTypeCliente }) => {
  console.log(rolTypeCliente);
  return tokenCliente && rolTypeCliente === "usuario" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default RoutesProtectedUserCliente;
