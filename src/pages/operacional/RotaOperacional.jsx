import { Navigate, useLocation } from "react-router-dom";
import OperacionalAuth from "./OperacionalAuth";
import { NotificacoesOperacionaisProvider } from "../../context/NotificacoesOperacionaisProvider";
import NotificacoesOperacionais from "../../components/pedido/NotificacoesOperacionais";

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
                const exibirNotificacoesOperacionais = ["/balcao", "/minipdv"].includes(location.pathname);

                if (!possuiPerfil) {
                    return <Navigate to="/login-operacional" state={{ acessoNegado: true }} replace />;
                }

                if (!exibirNotificacoesOperacionais) {
                    return children;
                }

                return (
                    <NotificacoesOperacionaisProvider>
                        {children}
                        <NotificacoesOperacionais />
                    </NotificacoesOperacionaisProvider>
                );
            }}
        </OperacionalAuth>
    );
}

export default RotaOperacional;
