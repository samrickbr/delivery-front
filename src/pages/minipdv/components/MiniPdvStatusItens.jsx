function formatarStatus(status) {
    const mapa = {
        PENDENTE: "Pendente",
        RECEBIDO: "Recebido",
        APROVADO: "Aprovado",
        EM_PRODUCAO: "Em produção",
        FINALIZADO: "Finalizado",
        CANCELADO: "Cancelado"
    };

    return mapa[status] || status || "Sem status";
}

function obterClasseStatus(status) {
    switch (status) {
        case "FINALIZADO":
            return "bg-success";

        case "EM_PRODUCAO":
            return "bg-warning text-dark";

        case "CANCELADO":
            return "bg-danger";

        case "APROVADO":
            return "bg-primary";

        case "RECEBIDO":
            return "bg-info text-dark";

        default:
            return "bg-secondary";
    }
}

function MiniPdvStatusItens({
    carrinho = [],
    aberto,
    onFechar
}) {
    if (!aberto) {
        return null;
    }

    return (
        <div
            className="modal d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Status dos itens
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onFechar}
                        />
                    </div>

                    <div className="modal-body p-0">
                        {carrinho.length === 0 ? (
                            <div className="text-center text-muted p-4">
                                Nenhum item no pedido.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-sm table-hover mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: "50px" }}>
                                                #
                                            </th>

                                            <th>
                                                Produto
                                            </th>

                                            <th
                                                className="text-center"
                                                style={{ width: "100px" }}
                                            >
                                                Qtd.
                                            </th>

                                            <th
                                                className="text-center"
                                                style={{ width: "130px" }}
                                            >
                                                Setor
                                            </th>

                                            <th
                                                className="text-center"
                                                style={{ width: "160px" }}
                                            >
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {carrinho.map((item, index) => (
                                            <tr
                                                key={`${item.id}-${index}`}
                                            >
                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <div className="fw-semibold">
                                                        {item.nome ||
                                                            item.produto ||
                                                            `Produto #${item.produtoId}`}
                                                    </div>
                                                </td>

                                                <td className="text-center">
                                                    {item.quantidade}
                                                </td>

                                                <td className="text-center">
                                                    {item.setor ? (
                                                        <span className="badge bg-secondary">
                                                            {item.setor}
                                                        </span>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>

                                                <td className="text-center">
                                                    <span
                                                        className={`badge ${obterClasseStatus(
                                                            item.statusOperacao
                                                        )}`}
                                                    >
                                                        {formatarStatus(
                                                            item.statusOperacao
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onFechar}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiniPdvStatusItens;
