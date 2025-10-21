import { Navigate, Route, Routes } from "react-router-dom";
import { ContenedorCardCateg } from "../components/ContenedorCardCateg";
import Ofertas from "../components/Ofertas";
import ContainerCart from "../components/ContainerCart";
import { CategoriaDetalles } from "../components/CategoriaDetalles";
import { ProductoDetalle } from "../components/ProductoDetalle";
import { LoginAdmin } from "../pages/LoginAdmin";
import { LoginCliente } from "../pages/LoginCliente";
import { RegistroCliente } from "../pages/RegistroCliente";
import { Home } from "../pages/Home";
import RoutesProtected from "./RoutesProtected";
import Dashboard from "../Admin/Dashboard";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import AdminProductos from "../Admin/AdminProductos";
import AdminCategorias from "../Admin/AdminCategorias";
import AdminUsuarios from "../Admin/AminUsuarios";
import AdminCupones from "../Admin/AdminCupones";
import AdminPedidos from "../Admin/AdminPedidos";
import ApexFitChatbot from "../pages/ApexFitChatbot";
import SobreNosotros from "../pages/SobreNosotros";
import DetallePedido from "../Admin/DetallePedido";
import ProductGalleryManager from "../Admin/ProductGalleryManager";
import RoutesProtectedUserCliente from "./RoutesProtectedUserCliente";
import PageCarrito from "../pages/PageCarrito";

export const RoutesGral = () => {
  const { tokenAdmin, rolTypeAdmin, tokenCliente, rolTypeCliente } =
    useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categorias" element={<ContenedorCardCateg />} />
      <Route path="/ofertas" element={<Ofertas />} />
      <Route path="/productos" element={<ContainerCart />} />
      <Route path="/categorias/:id" element={<CategoriaDetalles />} />
      <Route path="/productos/:id" element={<ProductoDetalle />} />
      <Route path="/administrador" element={<LoginAdmin />} />
      <Route path="/login" element={<LoginCliente />} />
      <Route path="/registro" element={<RegistroCliente />} />
      <Route path="/apexfit" element={<ApexFitChatbot />} />
      <Route path="/sobre nosotros" element={<SobreNosotros />} />
      <Route
        element={
          <RoutesProtectedUserCliente
            rolTypeCliente={rolTypeCliente}
            tokenCliente={tokenCliente}
          />
        }
      >
        <Route path="/carrito" element={<PageCarrito />} />
      </Route>
      <Route
        element={
          <RoutesProtected
            tokenAdmin={tokenAdmin}
            rolTypeAdmin={rolTypeAdmin}
          />
        }
      >
        <Route path="/administrador/panel" element={<Dashboard />} />
        <Route path="/administrador/productos" element={<AdminProductos />} />
        <Route path="/administrador/categorias" element={<AdminCategorias />} />
        <Route path="/administrador/usuarios" element={<AdminUsuarios />} />
        <Route path="/administrador/cupones" element={<AdminCupones />} />
        <Route path="/administrador/pedidos" element={<AdminPedidos />} />
        <Route
          path="/administrador/pedidos/detalles/:id"
          element={<DetallePedido />}
        />
        <Route
          path="/administrador/galeria"
          element={<ProductGalleryManager />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
