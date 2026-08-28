function MiniPdvRecebimento({
    tipoRecebimento,
    onTipoRecebimentoChange,
}) {
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <h2 className="h5 mb-3">
                    Recebimento
                </h2>

                <div className="row g-2">
                    <div className="col-6">
                        <button
                            type="button"
                            className={
                                tipoRecebimento === "RETIRADA"
                                    ? "btn btn-primary w-100"
                                    : "btn btn-outline-primary w-100"
                            }
                            onClick={() =>
                                onTipoRecebimentoChange(
                                    "RETIRADA"
                                )
                            }
                        >
                            Retirada
                        </button>
                    </div>

                    <div className="col-6">
                        <button
                            type="button"
                            className={
                                tipoRecebimento === "ENTREGA"
                                    ? "btn btn-primary w-100"
                                    : "btn btn-outline-primary w-100"
                            }
                            onClick={() =>
                                onTipoRecebimentoChange(
                                    "ENTREGA"
                                )
                            }
                        >
                            Entrega
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiniPdvRecebimento;
