function EnderecoEntrega({ enderecoSelecionado, onChange, disabled }) {
    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div
                        className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle"
                        style={{
                            width: "48px",
                            height: "48px",
                            flexShrink: 0
                        }}
                        aria-hidden="true"
                    >
                        📍
                    </div>

                    <div>
                        <h2 className="h5 mb-1">Endereço de entrega</h2>

                        <p className="text-muted small mb-0">Informe onde deseja receber seu pedido.</p>
                    </div>
                </div>

                <div className="alert alert-warning d-flex gap-3 align-items-start" role="alert">
                    <span className="fs-5" aria-hidden="true">
                        ⚠️
                    </span>

                    <div>
                        <strong className="d-block mb-1">Endereços ainda não disponíveis</strong>

                        <span>
                            O Delivery Back ainda não expõe o endpoint de endereços do cliente. Essa etapa será
                            integrada quando o contrato estiver disponível.
                        </span>
                    </div>
                </div>

                <div>
                    <label htmlFor="enderecoId" className="form-label fw-semibold">
                        ID do endereço
                    </label>

                    <input
                        id="enderecoId"
                        className="form-control form-control-lg"
                        type="number"
                        placeholder="Informe o enderecoId"
                        value={enderecoSelecionado || ""}
                        onChange={(event) => onChange(event.target.value)}
                        disabled={disabled}
                        inputMode="numeric"
                    />

                    <div className="form-text">
                        Campo temporário enquanto a integração de endereços não está disponível.
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EnderecoEntrega;
