function formatarEndereco(endereco) {
    const linhaPrincipal = [endereco.logradouro, endereco.numero].filter(Boolean).join(", ");

    const linhaSecundaria = [endereco.bairro, endereco.cidade, endereco.estado].filter(Boolean).join(" - ");

    return [linhaPrincipal, linhaSecundaria, endereco.cep].filter(Boolean).join(" • ");
}

function EnderecoEntrega({ enderecos, enderecoSelecionado, onChange, disabled, carregando }) {
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

                        <p className="text-muted small mb-0">Selecione onde deseja receber seu pedido.</p>
                    </div>
                </div>

                {carregando ? (
                    <div className="text-muted">Carregando seus endereços...</div>
                ) : enderecos.length === 0 ? (
                    <div className="alert alert-warning mb-0" role="alert">
                        Você não possui endereços cadastrados para entrega.
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-2">
                        {enderecos.map((endereco) => (
                            <label
                                key={endereco.id}
                                className={`border rounded-3 p-3 ${
                                    String(enderecoSelecionado) === String(endereco.id)
                                        ? "border-primary bg-primary-subtle"
                                        : ""
                                }`}
                                style={{ cursor: disabled ? "default" : "pointer" }}
                            >
                                <div className="d-flex gap-3 align-items-start">
                                    <input
                                        type="radio"
                                        name="enderecoEntrega"
                                        className="form-check-input mt-1"
                                        value={endereco.id}
                                        checked={String(enderecoSelecionado) === String(endereco.id)}
                                        onChange={(event) => onChange(event.target.value)}
                                        disabled={disabled}
                                    />

                                    <div>
                                        <div className="fw-semibold">
                                            {endereco.principal ? "Endereço principal" : "Endereço"}
                                        </div>

                                        <div className="small text-muted">{formatarEndereco(endereco)}</div>

                                        {endereco.complemento && (
                                            <div className="small text-muted">Complemento: {endereco.complemento}</div>
                                        )}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default EnderecoEntrega;
