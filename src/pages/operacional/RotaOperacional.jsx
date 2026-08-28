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

                if (perfil && !perfis.includes(perfil)) {
                    return <Navigate to="/acesso-negado" replace />;
                }

                return children;
            }}
        </OperacionalAuth>
    );
}

export default RotaOperacional;
