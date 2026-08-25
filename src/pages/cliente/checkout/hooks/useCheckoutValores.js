import { useMemo } from "react";
import { TIPOS_RECEBIMENTO } from "../checkoutUtils";

export function useCheckoutValores({ tipoRecebimento, valorProdutos, taxaEntregaConfigurada }) {
    const taxaEntrega = useMemo(() => {
        if (tipoRecebimento === TIPOS_RECEBIMENTO.RETIRADA) {
            return 0;
        }

        return taxaEntregaConfigurada ?? null;
    }, [tipoRecebimento, taxaEntregaConfigurada]);

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
