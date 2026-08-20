import { useState } from "react";
import { TIPOS_RECEBIMENTO } from "../checkoutUtils";

export function useCheckoutRecebimento() {
    const [tipoRecebimento, setTipoRecebimento] = useState(TIPOS_RECEBIMENTO.RETIRADA);

    const [enderecoSelecionado, setEnderecoSelecionado] = useState("");

    function selecionarTipoRecebimento(tipo) {
        setTipoRecebimento(tipo);

        if (tipo === TIPOS_RECEBIMENTO.RETIRADA) {
            setEnderecoSelecionado("");
        }
    }

    return {
        tipoRecebimento,
        enderecoSelecionado,
        setEnderecoSelecionado,
        selecionarTipoRecebimento
    };
}
