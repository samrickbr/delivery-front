import { Navigate, useLocation } from "react-router-dom";
import OperacionalAuth from "./OperacionalAuth";

function RotaOperacional({ perfil, children }) {
    const location = useLocation();

    return (
        <OperacionalAuth>
            {({ usuario, autenticado }) => {
                if (!autenticado) {
                    return <Navigate to="/login-operacional" state={{ from: location }} replace />;
                }

                const perfis = Array.isArray(usuario?.perfis) ? usuario.perfis : [];

                const possuiPerfil = !perfil || perfis.some((item) => item?.nome === perfil);

              if (!possuiPerfil) {
                  return <Navigate to="/login-operacional" state={{ acessoNegado: true }} replace />;
              }
                
                return children;
            }}
        </OperacionalAuth>
    );
}

export default RotaOperacional;
