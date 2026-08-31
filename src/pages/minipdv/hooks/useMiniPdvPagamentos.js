import { useMemo, useState } from "react";

function useMiniPdvPagamentos() {
    const [pagamentos, setPagamentos] = useState([]);

    function adicionarPagamento() {
        setPagamentos((atuais) => [
            ...atuais,
            {
                formaPagamentoId: null,
                valor: 0,
                confirmado: true
            }
        ]);
    }

    function alterarPagamento(index, pagamento) {
        setPagamentos((atuais) =>
            atuais.map((item, indice) =>
                indice === index
                    ? {
                          ...item,
                          ...pagamento
                      }
                    : item
            )
        );
    }

    function removerPagamento(index) {
        setPagamentos((atuais) =>
            atuais.filter((_, indice) => indice !== index)
        );
    }

    function limparPagamentos() {
        setPagamentos([]);
    }

    const totalPagamentos = useMemo(() => {
        return pagamentos.reduce(
            (total, pagamento) =>
                total + (Number(pagamento.valor) || 0),
            0
        );
    }, [pagamentos]);

    return {
        pagamentos,
        totalPagamentos,
        adicionarPagamento,
        alterarPagamento,
        removerPagamento,
        limparPagamentos
    };
}

export default useMiniPdvPagamentos;
