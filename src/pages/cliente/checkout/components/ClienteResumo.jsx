function ClienteResumo({ cliente }) {
    const nome = cliente?.nome || "Não disponível";
    const cpf = cliente?.cpf || "Não disponível";
    const telefone = cliente?.telefone || cliente?.whatsapp || "Não disponível";

    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body px-3 py-2">
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <div
                            className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle"
                            style={{
                                width: "34px",
                                height: "34px"
                            }}
                            aria-hidden="true"
                        >
                            👤
                        </div>

                        <strong>Cliente</strong>
                    </div>

                    <div className="d-none d-md-block text-muted">|</div>

                    <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 small">
                        <span>
                            <span className="text-muted">Nome:</span> <strong>{nome}</strong>
                        </span>

                        <span>
                            <span className="text-muted">CPF:</span> <strong>{cpf}</strong>
                        </span>

                        <span>
                            <span className="text-muted">WhatsApp:</span> <strong>{telefone}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ClienteResumo;
