import { useCallback, useState } from "react";

import { criarPedidoOperacional } from "../../../services/pedidoService";
import {
    ETAPA_PAGAMENTO,
    ETAPA_VENDA,
    calcularTroco,
    montarPedidoOperacional,
    montarPagamentosParaEnvio,
    validarPagamento
} from "../utils/miniPdvUtils";

function useMiniPdvFluxo({
    cliente,
    endereco,
    tipoRecebimento,
    carrinho,
    valorProdutos,
    pagamentos,
    totalPagamentos,
    limparVenda,
    limparCarrinho,
    limparPagamentos,
    podeFinalizar,
    showAlert
}) {
    const [etapa, setEtapa] = useState(ETAPA_VENDA);
    const [trocoFinal, setTrocoFinal] = useState(0);

    const limparNovaVenda = useCallback(() => {
        limparVenda();
        limparCarrinho();
        limparPagamentos();
        setTrocoFinal(0);
        setEtapa(ETAPA_VENDA);
    }, [limparVenda, limparCarrinho, limparPagamentos]);

    const finalizarVenda = useCallback(() => {
        if (!carrinho.length) {
            return;
        }

        if (!podeFinalizar) {
            return;
        }

        setEtapa(ETAPA_PAGAMENTO);
    }, [carrinho.length, podeFinalizar]);

    const voltarParaVenda = useCallback(() => {
        setEtapa(ETAPA_VENDA);
    }, []);

    const confirmarPagamento = useCallback(async () => {
        const erroPagamento = validarPagamento({
            pagamentos,
            valorProdutos,
            totalPagamentos
        });

        if (erroPagamento) {
            showAlert(erroPagamento);
            return;
        }

        const { ok: pagamentoValido } = montarPagamentosParaEnvio(pagamentos, valorProdutos);

        if (!pagamentoValido) {
            showAlert("Não foi possível montar os pagamentos da venda.");
            return;
        }

        const trocoCalculado = calcularTroco({
            pagamentos,
            valorVenda: valorProdutos
        });

        const pedido = montarPedidoOperacional({
            cliente,
            endereco,
            tipoRecebimento,
            carrinho,
            pagamentos,
            valorVenda: valorProdutos
        });

        try {
            await criarPedidoOperacional(pedido);

            setTrocoFinal(trocoCalculado);

            limparVenda();
            limparCarrinho();
            limparPagamentos();

            setEtapa(ETAPA_VENDA);

            if (trocoCalculado > 0) {
                return;
            }

            showAlert("Venda finalizada com sucesso.");
        } catch (error) {
            console.error("Erro ao finalizar venda operacional.", error);

            const mensagem = error?.response?.data?.message || "Não foi possível finalizar a venda.";

            showAlert(mensagem);
        }
    }, [
        cliente,
        endereco,
        tipoRecebimento,
        carrinho,
        valorProdutos,
        pagamentos,
        totalPagamentos,
        limparVenda,
        limparCarrinho,
        limparPagamentos,
        showAlert
    ]);

    return {
        etapa,
        setEtapa,
        trocoFinal,
        setTrocoFinal,
        finalizarVenda,
        confirmarPagamento,
        voltarParaVenda,
        limparNovaVenda
    };
}

export default useMiniPdvFluxo;
