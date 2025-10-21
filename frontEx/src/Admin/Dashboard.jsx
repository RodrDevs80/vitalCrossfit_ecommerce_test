import { Package, Grid3X3, Tag, Users, Info } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useEffect } from "react";
import { useState } from "react";
import fechDashboard from "../services/fechDashboard";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/serviceLogout";
import OrdenesDashboard from "./OrdenesDashboard";

const Dashboard = () => {
  const [productos, setProductos] = useState(0);
  const [categorias, setCategorias] = useState(0);
  const [cupones, setCupones] = useState(0);
  const [usuarios, setUsuarios] = useState(0);
  const [pedidos, setPedidos] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fechDashboard(
      setProductos,
      setCategorias,
      setCupones,
      setUsuarios,
      setPedidos
    );
  }, []);
  if (usuarios === null) {
    logoutAdmin();
    navigate("/administrador");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Productos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productos}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Productos disponibles en stock
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Categorías
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {categorias}
                    </p>
                  </div>
                  <Grid3X3 className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Categorías de productos creadas
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Cupones Activos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {cupones}
                    </p>
                  </div>
                  <Tag className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Cupones vigentes</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Usuarios
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {usuarios}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Usuarios registrados
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pedidos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pedidos == 0 ? "No hay pedidos" : pedidos}
                    </p>
                  </div>
                  <Info className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Total pedidos</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <OrdenesDashboard />
              {/* <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Futuras funcionalidades
              </h2>
              <p className="text-gray-600">
                Ideas: 1-podría se la posibilidad de registrar usuarios
                Administradores, solo tendría que aparecer si se posee
                autorización de administrador full. 2-Gráficas de algún tipo en
                funcion de pedidos (ordenes) o registro de nuevos usuarios.
                3-Administrar administradores para el Dashboard- solo visible
                para administradores full. 4-Administrar galerías de imágenes
                por producto al Dashboard -Ya realizado solo adaptar. 5-Tratar
                de incorporar cierre de sesion por falta de actividad! 6-
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
