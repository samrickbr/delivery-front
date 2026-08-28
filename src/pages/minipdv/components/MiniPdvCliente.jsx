function MiniPdvCliente({
    cliente = null,
    onClienteSelecionado,
    onDefinirEntrega,
    onDefinirRetirada
}) {
    function selecionarCliente() {
        /*
         * Este componente recebe o cliente já resolvido
         * pelo fluxo de identificação.
         *
         * A busca/seleção do cliente será conectada
         * posteriormente ao mecanismo de pesquisa do
         * Mini PDV.
         */
        onClienteSelecionado?.(cliente);
    }

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
                    <div className="text-muted small">
                        Cliente não identificado.
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
                    </>
                )}

                {cliente && (
                    <div className="mt-3">
                        <div className="small fw-semibold mb-2">
                            Tipo de atendimento
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-primary flex-fill"
                                onClick={
                                    onDefinirRetirada
                                }
                            >
                                Retirada
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-primary flex-fill"
                                onClick={
                                    onDefinirEntrega
                                }
                            >
                                Entrega
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MiniPdvCliente;
