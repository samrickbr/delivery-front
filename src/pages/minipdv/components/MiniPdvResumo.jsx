function MiniPdvResumo({
    valorProdutos = 0,
    taxaEntrega = 0,
    valorTotal = 0,
    tipoRecebimento,
}) {
    const mostrarTaxa =
        tipoRecebimento === "ENTREGA";

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <h2 className="h5 mb-3">
                    Resumo da venda
                </h2>

                <div className="d-flex justify-content-between mb-2">
                    <span>Produtos</span>

                    <strong>
                        R${" "}
                        {Number(valorProdutos).toFixed(2)}
                    </strong>
                </div>

                {mostrarTaxa && (
                    <div className="d-flex justify-content-between mb-2">
                        <span>Taxa de entrega</span>

                        <strong>
                            {taxaEntrega === null
                                ? "Calculando..."
                                : `R$ ${Number(
                                      taxaEntrega
                                  ).toFixed(2)}`}
                        </strong>
                    </div>
                )}

                <div className="border-top mt-3 pt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">
                            Total
                        </span>

                        <span className="fs-4 fw-bold">
                            {valorTotal === null
                                ? "Aguardando..."
                                : `R$ ${Number(
                                      valorTotal
                                  ).toFixed(2)}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiniPdvResumo;
