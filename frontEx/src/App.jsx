import { CuponProvider } from "./context/CuponProvider.jsx";
import { BrowserRouter, Routes } from "react-router-dom";
import { RoutesCabecera } from "./routes/RoutesCabecera.jsx";
import { RoutesPiePagina } from "./routes/RoutesPiePagina.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { RoutesGral } from "./routes/RoutesGral.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CuponProvider>
            <RoutesCabecera />
            <RoutesGral />
            <RoutesPiePagina />
          </CuponProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
