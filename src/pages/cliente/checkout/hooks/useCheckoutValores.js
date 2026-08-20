import { useMemo } from "react";
import { TIPOS_RECEBIMENTO } from "../checkoutUtils";

export function useCheckoutValores({ tipoRecebimento, valorProdutos, totalPagamentos }) {
    const taxaEntrega = tipoRecebimento === TIPOS_RECEBIMENTO.RETIRADA ? 0 : null;

    const valorTotal = taxaEntrega === null ? null : valorProdutos + taxaEntrega;

    const diferencaPagamento = useMemo(() => {
        if (valorTotal === null) {
            return null;
        }

        return valorTotal - totalPagamentos;
    }, [valorTotal, totalPagamentos]);

    return {
        taxaEntrega,
        valorTotal,
        diferencaPagamento
    };
}
