import { useEffect } from "react";

import { ABA_PDV, ETAPA_PAGAMENTO, ETAPA_VENDA } from "../utils/miniPdvUtils";

function deveIgnorarTecla(event) {
    const { target } = event;

    if (!target) {
        return false;
    }

    if (target.isContentEditable) {
        return true;
    }

    const tagName = target.tagName;

    return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}

function useMiniPdvAtalhos({
    aba,
    etapa,
    alertOpen,
    trocoFinal,
    onFinalizarVenda,
    onEnviarBalcao,
    onRecuperarVenda,
    onLimparNovaVenda,
    onVoltarParaVenda,
    onFecharAlerta,
    onFecharTrocoModal
}) {
    useEffect(() => {
        if (alertOpen || trocoFinal > 0) {
            return;
        }

        if (aba !== ABA_PDV || etapa !== ETAPA_VENDA) {
            return;
        }

        function tratarTecla(event) {
            if (event.ctrlKey || event.altKey || event.metaKey) {
                return;
            }

            const tecla = event.key;

            if (tecla !== "F2" && tecla !== "F3" && tecla !== "F4" && tecla !== "F5") {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (tecla === "F2") {
                onFinalizarVenda?.();
                return;
            }

            if (tecla === "F3") {
                onRecuperarVenda?.();
                return;
            }

            if (tecla === "F4") {
                onLimparNovaVenda?.();
                return;
            }

            if (tecla === "F5") {
                onEnviarBalcao?.();
            }
        }

        window.addEventListener("keydown", tratarTecla);

        return () => {
            window.removeEventListener("keydown", tratarTecla);
        };
    }, [aba, etapa, alertOpen, trocoFinal, onFinalizarVenda, onEnviarBalcao, onRecuperarVenda, onLimparNovaVenda]);

    useEffect(() => {
        if (!alertOpen && trocoFinal <= 0) {
            return;
        }

        function tratarTecla(event) {
            if (deveIgnorarTecla(event)) {
                return;
            }

            const tecla = event.key;
            const ehEspaco = event.code === "Space" || tecla === " " || tecla === "Spacebar";

            if (tecla !== "Enter" && !ehEspaco && tecla !== "Escape") {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            if (trocoFinal > 0) {
                onFecharTrocoModal?.();
                return;
            }

            onFecharAlerta?.();
        }

        window.addEventListener("keydown", tratarTecla, true);

        return () => {
            window.removeEventListener("keydown", tratarTecla, true);
        };
    }, [alertOpen, trocoFinal, onFecharAlerta, onFecharTrocoModal]);

    useEffect(() => {
        if (aba !== ABA_PDV || etapa !== ETAPA_PAGAMENTO) {
            return;
        }

        function tratarTecla(event) {
            if (event.ctrlKey || event.altKey || event.metaKey || deveIgnorarTecla(event)) {
                return;
            }

            if (event.key !== "Escape") {
                return;
            }

            event.preventDefault();
            onVoltarParaVenda?.();
        }

        window.addEventListener("keydown", tratarTecla);

        return () => {
            window.removeEventListener("keydown", tratarTecla);
        };
    }, [aba, etapa, onVoltarParaVenda]);
}

export default useMiniPdvAtalhos;
