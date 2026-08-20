import { useMemo, useState } from "react";

export function useCheckoutPagamentos() {
    const [pagamentos, setPagamentos] = useState([]);

    const totalPagamentos = useMemo(() => {
        return pagamentos.reduce((total, pagamento) => total + Number(pagamento.valor || 0), 0);
    }, [pagamentos]);

    function adicionarPagamento() {
        setPagamentos((estado) => [
            ...estado,
            {
                formaPagamentoId: "",
                valor: "",
                confirmado: false
            }
        ]);
    }

    function alterarPagamento(index, campo, valor) {
        setPagamentos((estado) =>
            estado.map((pagamento, pagamentoIndex) =>
                pagamentoIndex === index
                    ? {
                          ...pagamento,
                          [campo]: valor,
                          confirmado: false
                      }
                    : pagamento
            )
        );
    }

    function confirmarPagamento(index) {
        setPagamentos((estado) =>
            estado.map((pagamento, pagamentoIndex) =>
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
        setPagamentos((estado) => estado.filter((_, pagamentoIndex) => pagamentoIndex !== index));
    }

    return {
        pagamentos,
        totalPagamentos,
        adicionarPagamento,
        alterarPagamento,
        confirmarPagamento,
        removerPagamento
    };
}
