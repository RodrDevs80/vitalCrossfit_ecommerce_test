import React, { useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [tokenAdmin, setTokenAdmin] = useState(
    JSON.parse(localStorage.getItem("passAdmin"))?.accessToken || null
  );
  const [rolTypeAdmin, setRolTypeAdmin] = useState(
    JSON.parse(localStorage.getItem("passAdmin"))?.typeRol || null
  );
  const [tokenCliente, setTokenCliente] = useState(
    JSON.parse(localStorage.getItem("passCliente"))?.accessToken || null
  );
  const [rolTypeCliente, setRolTyCliente] = useState(
    JSON.parse(localStorage.getItem("passCliente"))?.typeRol || null
  );

  const [idAdmin, setIdAdmin] = useState(
    JSON.parse(localStorage.getItem("passAdmin"))?.id || null
  );
  const [idCliente, setIdCliente] = useState(
    JSON.parse(localStorage.getItem("passCliente"))?.id || null
  );

  return (
    <AuthContext.Provider
      value={{
        tokenAdmin,
        tokenCliente,
        setTokenAdmin,
        setTokenCliente,
        rolTypeAdmin,
        rolTypeCliente,
        setRolTyCliente,
        setRolTypeAdmin,
        idAdmin,
        setIdAdmin,
        idCliente,
        setIdCliente,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
