function CheckoutHeader() {
    return (
        <section className="mb-3">
            <div className="card border-0 shadow-sm">
                <div className="card-body px-3 py-3 px-md-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="flex-grow-1">
                            <span className="badge text-bg-primary rounded-pill mb-2">Finalização</span>

                            <h1 className="h3 fw-bold mb-1">Revisar pedido</h1>

                            <p className="text-muted mb-0 small">Confira seus dados antes de confirmar o pedido.</p>
                        </div>

                        <div className="fs-2 d-none d-sm-block" aria-hidden="true">
                            🧾
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CheckoutHeader;
