import { useState } from "react";

import { TIPOS_RECEBIMENTO } from "../checkoutUtils";

export function useCheckoutRecebimento(enderecos = []) {
    const [tipoRecebimento, setTipoRecebimento] = useState(null);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState("");

    function selecionarTipoRecebimento(tipo) {
        setTipoRecebimento(tipo);

        if (tipo === TIPOS_RECEBIMENTO.RETIRADA) {
            setEnderecoSelecionado("");
            return;
        }

        const enderecoPrincipal = enderecos.find((endereco) => endereco.principal);

        if (enderecoPrincipal?.id) {
            setEnderecoSelecionado(String(enderecoPrincipal.id));
        }
    }

    return {
        tipoRecebimento,
        enderecoSelecionado,
        setEnderecoSelecionado,
        selecionarTipoRecebimento
    };
}
