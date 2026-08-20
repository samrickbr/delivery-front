function CheckoutErro({ erro }) {
    if (!erro) {
        return null;
    }

    return (
        <div className="alert alert-danger" role="alert">
            {erro}
        </div>
    );
}

export default CheckoutErro;
