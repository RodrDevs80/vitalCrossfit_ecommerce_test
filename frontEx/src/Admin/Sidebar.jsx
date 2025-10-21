import {
  Grid3X3,
  Home,
  Image,
  Info,
  LogOut,
  Menu,
  Package,
  Tag,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/serviceLogout";
import { ToastContainer } from "react-toastify";

export const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { id: "panel", label: "Dashboard", icon: Home },
    { id: "productos", label: "Productos", icon: Package },
    { id: "categorias", label: "Categorías", icon: Grid3X3 },
    { id: "cupones", label: "Cupones", icon: Tag },
    { id: "usuarios", label: "Usuarios", icon: Users },
    { id: "pedidos", label: "Pedidos", icon: Info },
    { id: "galeria", label: "galerias", icon: Image },
  ];

  const handleLogout = () => {
    logoutAdmin();
    setTimeout(() => {
      navigate("/administrador");
    }, 5000);
  };
  return (
    <div
      className={`bg-white transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2
          className={`font-bold text-xl text-gray-800 ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          Admin Panel
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              to={`/administrador/${item.id}`}
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                activeSection === item.id
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-700"
              }`}
            >
              <IconComponent className="h-5 w-5 mr-3" />
              <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      {/* Logout Button */}
      <div className="absolute bottom-4 px-4 flex-shrink-0">
        <ToastContainer />;
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className={`${sidebarOpen ? "block" : "hidden"}`}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </div>
  );
};
