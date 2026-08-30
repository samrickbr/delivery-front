function MiniPdvCliente({
    cliente = null,
    onDefinirEntrega,
    onDefinirRetirada
}) {
    return (
        <div className="border rounded bg-body">
            <div className="p-3 border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                    <strong>Cliente</strong>

                    {cliente && (
                        <span className="badge text-bg-success">
                            Identificado
                        </span>
                    )}
                </div>
            </div>

            <div className="p-3">
                {!cliente ? (
                    <div className="text-muted">
                        <div className="fw-semibold mb-1">
                            Nenhum cliente identificado
                        </div>

                        <small>
                            A identificação do cliente será
                            disponibilizada na próxima etapa
                            do Mini PDV.
                        </small>
                    </div>
                ) : (
                    <>
                        <div className="fw-semibold">
                            {cliente.nome ||
                                cliente.nomeCompleto ||
                                "Cliente"}
                        </div>

                        {cliente.cpf && (
                            <div className="text-muted small">
                                CPF: {cliente.cpf}
                            </div>
                        )}

                        <div className="mt-3">
                            <div className="small fw-semibold mb-2">
                                Tipo de atendimento
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-primary flex-fill"
                                    onClick={onDefinirRetirada}
                                >
                                    Retirada
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary flex-fill"
                                    onClick={onDefinirEntrega}
                                >
                                    Entrega
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MiniPdvCliente;
