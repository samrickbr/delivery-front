import { useEffect, useState } from "react";
import { listarFormasPagamento } from "../../../../services/formaPagamentoService";
import { normalizarListaFormasPagamento } from "../../../minipdv/utils/miniPdvUtils";

export function useCheckoutFormasPagamento() {
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            setCarregando(true);
            setErro("");

            try {
                const resposta = await listarFormasPagamento();

                if (!ativo) {
                    return;
                }

                const lista = normalizarListaFormasPagamento(resposta);
                const formasAtivas = lista.filter((forma) => forma?.ativo === true || forma?.ativo === "true");

                setFormasPagamento(formasAtivas);
            } catch {
                if (!ativo) {
                    return;
                }

                setFormasPagamento([]);
                setErro("Não foi possível carregar as formas de pagamento.");
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregar();

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
