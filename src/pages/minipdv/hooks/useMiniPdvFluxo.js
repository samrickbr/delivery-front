import { useCallback, useState } from "react";

import {
    adicionarPagamentoPedido,
    criarPedidoOperacional,
    faturarPedido
} from "../../../services/pedidoService";

import {
    ETAPA_PAGAMENTO,
    ETAPA_VENDA,
    calcularTroco,
    montarPedidoOperacional,
    montarPagamentosParaEnvio,
    validarPagamento
} from "../utils/miniPdvUtils";

function useMiniPdvFluxo({
    pedidoId,
    cliente,
    endereco,
    tipoRecebimento,
    taxaEntrega,
    carrinho,
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

            const pagamentosExistentes = pagamentosAtuais.filter(
                (pagamento) => pagamento.existente === true
            );

            const pagamentosNovos = pagamentosAtuais.filter(
                (pagamento) => pagamento.existente !== true
            );

            const totalExistente = pagamentosExistentes.reduce(
                (total, pagamento) =>
                    total + (Number(pagamento.valor) || 0),
                0
            );

            const totalNovo = pagamentosNovos.reduce(
                (total, pagamento) =>
                    total + (Number(pagamento.valor) || 0),
                0
            );

            const valorRestante = Math.max(
                Number(valorVenda) - totalExistente,
                0
            );

            /*
             * Pedido recuperado já totalmente pago:
             * não há pagamento novo para validar/enviar.
             * Basta faturar o pedido existente.
             */
            if (pedidoId && valorRestante <= 0) {
                try {
                    await faturarPedido(pedidoId);

                    setTrocoFinal(0);

                    limparVenda();
                    limparCarrinho();
                    limparPagamentos();

                    setEtapa(ETAPA_VENDA);

                    showAlert("Venda finalizada com sucesso.");
                } catch (error) {
                    console.error(
                        "Erro ao faturar pedido recuperado.",
                        error
                    );

                    const mensagem =
                        error?.response?.data?.message ||
                        "Não foi possível finalizar a venda.";

                    showAlert(mensagem);
                }

                return;
            }

            /*
             * Para um pedido parcialmente pago, validamos somente
             * o valor que ainda falta receber.
             *
             * validarPagamento calcula:
             * valorProdutos + taxaEntrega
             *
             * Por isso, retiramos a taxa do valor restante e zeramos
             * a taxa enviada ao validador para evitar dupla cobrança.
             */
            const taxaRestante = Math.min(
                Number(taxaEntrega) || 0,
                valorRestante
            );

            const produtosRestantes = Math.max(
                valorRestante - taxaRestante,
                0
            );

            const erroPagamento = validarPagamento({
                pagamentos: pagamentosNovos,
                valorProdutos: produtosRestantes,
                totalPagamentos: totalNovo,
                tipoRecebimento,
                taxaEntrega: taxaRestante
            });

            if (erroPagamento) {
                showAlert(erroPagamento);

                return;
            }

            const resultadoPagamentos = montarPagamentosParaEnvio(
                pagamentosNovos,
                valorRestante
            );

            if (!resultadoPagamentos.ok) {
                showAlert(
                    "Não foi possível montar os pagamentos da venda."
                );

                return;
            }

            const trocoCalculado = calcularTroco({
                pagamentos: pagamentosNovos,
                valorVenda: valorRestante
            });

            try {
                if (pedidoId) {
                    /*
                     * Pedido recuperado:
                     * somente os pagamentos novos são enviados.
                     * Os pagamentos existentes permanecem no Core.
                     */
                    for (const pagamento of resultadoPagamentos.pagamentos) {
                        await adicionarPagamentoPedido(
                            pedidoId,
                            pagamento
                        );
                    }

                    await faturarPedido(pedidoId);
                } else {
                    /*
                     * Venda nova:
                     * todos os pagamentos desta operação são novos.
                     */
                    const pedido = montarPedidoOperacional({
                        cliente,
                        endereco,
                        tipoRecebimento,
                        carrinho,
                        pagamentos: resultadoPagamentos.pagamentos,
                        valorVenda
                    });

                    await criarPedidoOperacional(pedido);
                }

                setTrocoFinal(trocoCalculado);

                limparVenda();
                limparCarrinho();
                limparPagamentos();

                setEtapa(ETAPA_VENDA);

                if (trocoCalculado > 0) {
                    showAlert(
                        `Venda finalizada com sucesso. Troco: ${trocoCalculado.toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL"
                            }
                        )}`
                    );

                    return;
                }

                showAlert("Venda finalizada com sucesso.");
            } catch (error) {
                console.error(
                    "Erro ao finalizar pagamento.",
                    error
                );

                const mensagem =
                    error?.response?.data?.message ||
                    "Não foi possível finalizar a venda.";

                showAlert(mensagem);
            }
        },
        [
            pedidoId,
            pagamentos,
            cliente,
            endereco,
            tipoRecebimento,
            taxaEntrega,
            carrinho,
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
