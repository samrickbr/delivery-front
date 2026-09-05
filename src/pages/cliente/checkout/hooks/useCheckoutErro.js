import { useCallback, useState } from "react";

export function useCheckoutErro() {
    const [erro, setErro] = useState("");
    const [versaoErro, setVersaoErro] = useState(0);

    const registrarErro = useCallback((mensagem) => {
        setErro(mensagem);

        if (mensagem) {
            setVersaoErro((versao) => versao + 1);
        }
    }, []);

    return {
        erro,
        setErro: registrarErro,
        versaoErro
    };
}
