import { useCallback, useState } from "react";

export function useCheckoutErro() {
    const [erro, setErro] = useState("");
    const [campoErro, setCampoErro] = useState(null);
    const [versaoErro, setVersaoErro] = useState(0);

    const registrarErro = useCallback((mensagem, campo = null) => {
        setErro(mensagem);
        setCampoErro(mensagem ? campo : null);

        if (mensagem) {
            setVersaoErro((versao) => versao + 1);
        }
    }, []);

    return {
        erro,
        campoErro,
        setErro: registrarErro,
        versaoErro
    };
}
