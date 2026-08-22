import { useMemo } from "react";
import { TIPOS_RECEBIMENTO } from "../checkoutUtils";

export function useCheckoutValores({ tipoRecebimento, valorProdutos }) {
    const taxaEntrega = tipoRecebimento === TIPOS_RECEBIMENTO.RETIRADA ? 0 : null;

    const valorTotal = useMemo(() => {
        if (taxaEntrega === null) {
            return null;
        }

        return valorProdutos + taxaEntrega;
    }, [valorProdutos, taxaEntrega]);

    return {
        taxaEntrega,
        valorTotal
    };
}
