import { useEffect, useRef, useState } from "react";

/**
 * Controla o destaque visual (borda, foco e scroll) de um campo do checkout
 * quando ele é o responsável pelo erro de validação atual.
 */
export function useCampoErro({ campos, campoErro, versaoErro }) {
    const ref = useRef(null);
    const [animando, setAnimando] = useState(false);
    const comErro = Boolean(campoErro) && campos.includes(campoErro);

    useEffect(() => {
        if (!comErro || !ref.current) {
            return undefined;
        }

        const elemento = ref.current;
        const reduzirMovimento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        elemento.scrollIntoView({
            behavior: reduzirMovimento ? "auto" : "smooth",
            block: "center",
            inline: "nearest"
        });

        if (typeof elemento.focus === "function") {
            elemento.focus({ preventScroll: true });
        }

        setAnimando(true);

        const temporizador = window.setTimeout(() => {
            setAnimando(false);
        }, 1500);

        return () => {
            window.clearTimeout(temporizador);
        };
    }, [comErro, versaoErro]);

    return { ref, comErro, animando };
}
