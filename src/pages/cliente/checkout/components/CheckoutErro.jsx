// Alerta flutuante: fica fixo na viewport e não move o scroll da página.
// O direcionamento até o campo inválido é feito pelo próprio campo (useCampoErro).
function CheckoutErro({ erro, versaoErro }) {
    if (!erro) {
        return null;
    }

    return (
        <div
            key={versaoErro}
            className="alert alert-danger shadow-lg mb-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
                position: "fixed",
                left: "50%",
                bottom: "1rem",
                transform: "translateX(-50%)",
                zIndex: 1080,
                width: "min(92vw, 480px)"
            }}
        >
            {erro}
        </div>
    );
}

export default CheckoutErro;
