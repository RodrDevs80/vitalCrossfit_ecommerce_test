import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import serviceLogin from "../services/serviceLogin";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import swalServiceConfirmed from "../services/swalServiceConfirmed";
import SwAlertaComp from "../services/SwAlertaComp";

const Login = ({ typeUser }) => {
  const {
    setTokenAdmin,
    setRolTypeAdmin,
    setTokenCliente,
    setRolTyCliente,
    setIdCliente,
    setIdAdmin,
  } = useContext(AuthContext);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const handleCredenciales = (e) => {
    e.preventDefault();
    const { email, password } = credenciales;

    serviceLogin(
      `http://localhost:3000/api/v1/auth/login`,
      email,
      password,
      pathname
    )
      .then((res) => {
        if (res.typeRol === "administrador") {
          setRolTypeAdmin(res.typeRol);
          setTokenAdmin(res.accessToken);
          setIdAdmin(res.id);
          setTimeout(() => {
            navigate("/administrador/panel");
          }, 5000);
        } else if (res.typeRol === "usuario") {
          console.log(res.typeRol);
          setRolTyCliente(res.typeRol);
          setTokenCliente(res.accessToken);
          setIdCliente(res.id);
          setTimeout(() => {
            navigate("/carrito");
          }, 5000);
        } else if (res === "pagina equivocada") {
          swalServiceConfirmed(
            "Error de validación",
            "Desea intentar de nuevo o volver a al home",
            "info",
            "intentar de nuevo",
            "home"
          ).then((confirmar) => {
            if (confirmar) {
              navigate("/login");
            } else {
              navigate("/");
            }
          });
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err.message);
        SwAlertaComp("Error!", "Credenciales no validas", "error");
      });
  };

  return (
    <div className="w-80 rounded-lg shadow h-auto p-6 bg-white relative overflow-hidden">
      <div className="flex flex-col justify-center items-center space-y-2">
        <h2 className="text-2xl font-medium text-slate-700">{typeUser}</h2>
        <p className="text-slate-500">Ingrese los detalles a continuación.</p>
      </div>
      <form className="w-full mt-4 space-y-3">
        <div>
          <input
            className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
            placeholder="email"
            id="email"
            name="email"
            type="email"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <input
            className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
            placeholder="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center"></div>
        </div>
        <ToastContainer />
        <button
          className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2"
          id="login"
          name="login"
          type="submit"
          onClick={(e) => handleCredenciales(e)}
        >
          login
        </button>

        {typeUser.includes("administrador") ? null : (
          <p className="flex justify-center space-x-1">
            <span className="text-slate-700"> ¿Tienes una cuenta?</span>
            <Link className="text-blue-500 hover:underline" to="/registro">
              Regístrate
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
