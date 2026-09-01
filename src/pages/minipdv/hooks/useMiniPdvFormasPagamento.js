import { useEffect, useState } from "react";
import { listarFormasPagamento } from "../../../services/formaPagamentoService";
import { normalizarListaFormasPagamento } from "../utils/miniPdvUtils";

function useMiniPdvFormasPagamento() {
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarFormasPagamento() {
            try {
                setCarregando(true);
                setErro("");

                const resposta = await listarFormasPagamento();

                if (!ativo) {
                    return;
                }

                const lista = normalizarListaFormasPagamento(resposta);
                const formasAtivas = lista.filter((forma) => forma?.ativo === true || forma?.ativo === "true");

                setFormasPagamento(formasAtivas);
            } catch (error) {
                if (!ativo) {
                    return;
                }

                console.error("Erro ao carregar formas de pagamento.", error);

                setFormasPagamento([]);
                setErro("Não foi possível carregar as formas de pagamento.");
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarFormasPagamento();

        return () => {
            ativo = false;
        };
    }, []);

    return {
        formasPagamento,
        carregando,
        erro
    };
}

export default useMiniPdvFormasPagamento;
