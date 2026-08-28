import { useEffect, useState } from "react";
import { buscarOperacionalAutenticado } from "../../services/operacionalService";

function OperacionalAuth({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let ativo = true;

        async function carregarSessao() {
            const token = sessionStorage.getItem("operacionalToken");

            if (!token) {
                if (ativo) {
                    setCarregando(false);
                }

                return;
            }

            try {
                const dados = await buscarOperacionalAutenticado();

                if (ativo) {
                    setUsuario(dados);
                }
            } catch (error) {
                console.error("Erro ao carregar sessão operacional.", error);

                sessionStorage.removeItem("operacionalToken");

                if (ativo) {
                    setUsuario(null);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarSessao();

        return () => {
            ativo = false;
        };
    }, []);

    function limparSessao() {
        sessionStorage.removeItem("operacionalToken");
        setUsuario(null);
    }

    if (carregando) {
        return null;
    }

    return children({
        usuario,
        autenticado: !!usuario,
        logout: limparSessao
    });
}

export default OperacionalAuth;
