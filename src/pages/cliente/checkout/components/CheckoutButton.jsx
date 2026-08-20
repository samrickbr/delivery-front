function CheckoutButton({ enviando, disabled, onClick }) {
    return (
        <button
            type="button"
            className="btn btn-success btn-lg w-100"
            disabled={disabled || enviando}
            onClick={onClick}
        >
            {enviando ? "Enviando pedido..." : "Validar checkout"}
        </button>
    );
}

export default CheckoutButton;
