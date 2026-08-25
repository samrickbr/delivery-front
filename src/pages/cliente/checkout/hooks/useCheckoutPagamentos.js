import { useState } from "react";

export function useCheckoutPagamentos() {
    const [pagamentos, setPagamentos] = useState([]);

    function selecionarFormaPagamento(formaPagamentoId, valorTotal) {
        setPagamentos((atuais) => {
            const id = Number(formaPagamentoId);

            const jaSelecionado = atuais.some((pagamento) => Number(pagamento.formaPagamentoId) === id);

            if (jaSelecionado) {
                return [];
            }

            return [
                {
                    formaPagamentoId: id,
                    valor: Number(valorTotal) || 0,
                    confirmado: true
                }
            ];
        });
    }

    function removerPagamento() {
        setPagamentos([]);
    }

    const totalPagamentos = pagamentos.reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0);

    return {
        pagamentos,
        totalPagamentos,
        selecionarFormaPagamento,
        removerPagamento
    };
}
