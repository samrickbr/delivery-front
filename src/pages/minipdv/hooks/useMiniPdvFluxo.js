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
    taxaEntrega,
    carrinho,
    valorProdutos,
    valorVenda,
    pagamentos,
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

    const confirmarPagamento = useCallback(
        async (pagamentosConfirmados = pagamentos) => {
            const pagamentosAtuais = Array.isArray(pagamentosConfirmados)
                ? pagamentosConfirmados
                : Array.isArray(pagamentosConfirmados?.pagamentos)
                  ? pagamentosConfirmados.pagamentos
                  : [];

            const totalRecebido = pagamentosAtuais.reduce(
                (total, pagamento) => total + (Number(pagamento.valor) || 0),
                0
            );

            const erroPagamento = validarPagamento({
                pagamentos: pagamentosAtuais,
                valorProdutos,
                totalPagamentos: totalRecebido,
                tipoRecebimento,
                taxaEntrega
            });

            if (erroPagamento) {
                showAlert(erroPagamento);

                return;
            }

            const resultadoPagamentos = montarPagamentosParaEnvio(pagamentosAtuais, valorVenda);

            if (!resultadoPagamentos.ok) {
                showAlert("Não foi possível montar os pagamentos da venda.");

                return;
            }

            const trocoCalculado = calcularTroco({
                pagamentos: pagamentosAtuais,
                valorVenda
            });

            const pedido = montarPedidoOperacional({
                cliente,
                endereco,
                tipoRecebimento,
                carrinho,
                pagamentos: resultadoPagamentos.pagamentos,
                valorVenda
            });

            try {
                await criarPedidoOperacional(pedido);

                setTrocoFinal(trocoCalculado);

                limparVenda();
                limparCarrinho();
                limparPagamentos();

                setEtapa(ETAPA_VENDA);

                if (trocoCalculado > 0) {
                    showAlert(
                        `Venda finalizada com sucesso. Troco: ${trocoCalculado.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}`
                    );

                    return;
                }

                showAlert("Venda finalizada com sucesso.");
            } catch (error) {
                console.error("Erro ao finalizar venda operacional.", error);

                const mensagem = error?.response?.data?.message || "Não foi possível finalizar a venda.";

                showAlert(mensagem);
            }
        },
        [
            pagamentos,
            cliente,
            endereco,
            tipoRecebimento,
            taxaEntrega,
            carrinho,
            valorProdutos,
            valorVenda,
            limparVenda,
            limparCarrinho,
            limparPagamentos,
            showAlert
        ]
    );

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
