import { useMemo, useState } from "react";

export function useCheckoutPagamentos() {
    const [pagamentos, setPagamentos] = useState([]);

    function selecionarFormaPagamento(formaPagamentoId, valorTotal) {
        setPagamentos((atuais) => {
            const pagamentoExistente = atuais.find(
                (pagamento) => Number(pagamento.formaPagamentoId) === Number(formaPagamentoId)
            );

            if (pagamentoExistente) {
                return atuais;
            }

            return [
                ...atuais,
                {
                    formaPagamentoId,
                    valor: atuais.length === 0 ? (valorTotal ?? 0) : 0,
                    confirmado: false
                }
            ];
        });
    }

    function alterarValorPagamento(index, valor) {
        setPagamentos((atuais) =>
            atuais.map((pagamento, pagamentoIndex) =>
                pagamentoIndex === index
                    ? {
                          ...pagamento,
                          valor,
                          confirmado: false
                      }
                    : pagamento
            )
        );
    }

    function confirmarPagamento(index) {
        setPagamentos((atuais) =>
            atuais.map((pagamento, pagamentoIndex) =>
                pagamentoIndex === index
                    ? {
                          ...pagamento,
                          confirmado: true
                      }
                    : pagamento
            )
        );
    }

    function removerPagamento(index) {
        setPagamentos((atuais) => atuais.filter((_, pagamentoIndex) => pagamentoIndex !== index));
    }

    const totalPagamentos = useMemo(
        () => pagamentos.reduce((total, pagamento) => total + (Number(pagamento.valor) || 0), 0),
        [pagamentos]
    );

    return {
        pagamentos,
        totalPagamentos,
        selecionarFormaPagamento,
        alterarValorPagamento,
        confirmarPagamento,
        removerPagamento
    };
}
