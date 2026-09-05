import { useState } from "react";

export function useCheckoutPagamentos() {
    const [pagamentos, setPagamentos] = useState([]);

    function selecionarFormaPagamento(formaPagamentoId) {
        setPagamentos((atuais) => {
            const id = Number(formaPagamentoId);

            const jaSelecionado = atuais.some((pagamento) => Number(pagamento.formaPagamentoId) === id);

            if (jaSelecionado) {
                return [];
            }

            return [
                {
                    formaPagamentoId: id,
                    confirmado: true
                }
            ];
        });
    }

    function removerPagamento() {
        setPagamentos([]);
    }

    return {
        pagamentos,
        selecionarFormaPagamento,
        removerPagamento
    };
}
