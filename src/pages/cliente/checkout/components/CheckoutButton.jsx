function CheckoutButton({ enviando, disabled, onClick }) {
    const bloqueado = disabled || enviando;

    return (
        <div>
            <button
                type="button"
                className="btn btn-success w-100 rounded-pill fw-semibold py-2"
                disabled={bloqueado}
                onClick={onClick}
            >
                {enviando ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Enviando pedido...
                    </>
                ) : (
                    <>
                        Confirmar pedido
                        <span className="ms-2" aria-hidden="true">
                            →
                        </span>
                    </>
                )}
            </button>

            <p className="text-muted text-center small mb-0 mt-1">Confira os dados antes de confirmar.</p>
        </div>
    );
}

export default CheckoutButton;
