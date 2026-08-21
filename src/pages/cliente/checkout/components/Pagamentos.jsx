function Pagamentos() {
    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                        className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle"
                        style={{
                            width: "48px",
                            height: "48px",
                            flexShrink: 0
                        }}
                        aria-hidden="true"
                    >
                        💳
                    </div>

                    <div>
                        <h2 className="h5 mb-1">Pagamento</h2>

                        <p className="text-muted small mb-0">Formas de pagamento disponíveis.</p>
                    </div>
                </div>

                <div className="alert alert-warning mb-0" role="alert">
                    <strong className="d-block mb-1">Formas de pagamento aguardando contrato</strong>

                    <span className="small">
                        O Delivery Back já aceita pagamentos no pedido, utilizando <code>formaPagamentoId</code> e{" "}
                        <code>valor</code>, mas ainda não disponibiliza um endpoint para consultar as formas de
                        pagamento disponíveis.
                    </span>
                </div>
            </div>
        </section>
    );
}

export default Pagamentos;
