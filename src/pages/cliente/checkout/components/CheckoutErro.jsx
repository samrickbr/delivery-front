import { useEffect, useRef, useState } from "react";

function CheckoutErro({ erro, versaoErro }) {
    const alertaRef = useRef(null);
    const [destacado, setDestacado] = useState(false);

    useEffect(() => {
        if (!erro || !alertaRef.current) {
            return undefined;
        }

        const alerta = alertaRef.current;
        const reduzirMovimento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        alerta.scrollIntoView({
            behavior: reduzirMovimento ? "auto" : "smooth",
            block: "center"
        });
        alerta.focus({ preventScroll: true });
        setDestacado(true);

        const temporizador = window.setTimeout(() => {
            setDestacado(false);
        }, 2000);

        return () => {
            window.clearTimeout(temporizador);
        };
    }, [erro, versaoErro]);

    if (!erro) {
        return null;
    }

    return (
        <div
            ref={alertaRef}
            className="alert alert-danger"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            tabIndex="-1"
            style={{
                outline: destacado ? "2px solid var(--bs-danger)" : "2px solid transparent",
                boxShadow: destacado ? "0 0 0 0.25rem rgba(var(--bs-danger-rgb), 0.18)" : "none",
                transition: "outline-color 150ms ease, box-shadow 150ms ease"
            }}
        >
            {erro}
        </div>
    );
}

export default CheckoutErro;
