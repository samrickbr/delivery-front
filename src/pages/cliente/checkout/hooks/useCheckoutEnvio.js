import { useState } from "react";

export function useCheckoutEnvio() {
    const [enviando, setEnviando] = useState(false);
    const [pedidoCriado, setPedidoCriado] = useState(null);

    return {
        enviando,
        setEnviando,
        pedidoCriado,
        setPedidoCriado
    };
}
