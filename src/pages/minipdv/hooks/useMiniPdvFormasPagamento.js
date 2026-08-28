import { useEffect, useState } from "react";
import { listarFormasPagamento } from "../../../services/formaPagamentoService";

function useMiniPdvFormasPagamento() {
    const [formasPagamento, setFormasPagamento] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarFormasPagamento() {
            try {
                setCarregando(true);
                setErro("");

                const resposta = await listarFormasPagamento();

                const dados = resposta?.data ?? resposta ?? [];

                setFormasPagamento(
                    Array.isArray(dados) ? dados : []
                );
            } catch (error) {
                console.error(
                    "Erro ao carregar formas de pagamento.",
                    error
                );

                setErro(
                    "Não foi possível carregar as formas de pagamento."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarFormasPagamento();
    }, []);

    return {
        formasPagamento,
        carregando,
        erro,
    };
}

export default useMiniPdvFormasPagamento;
