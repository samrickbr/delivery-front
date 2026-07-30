import HistoricoPedido from "./HistoricoPedido";

function PedidoCard({ pedido, children, mostrarValor = true }) {
    console.log("PEDIDO CARD:", pedido);
    function badgeStatus(status) {
        switch (status) {
            case "APROVADO":
                return "bg-warning text-dark";

            case "EM_PRODUCAO":
                return "bg-primary";

            case "PENDENTE":
                return "bg-danger";

            case "FINALIZADO":
                return "bg-success";

            case "ENTREGUE":
                return "bg-success";

            case "SAIU_ENTREGA":
                return "bg-info text-dark";

            case "CANCELADO":
                return "bg-dark";

            default:
                return "bg-secondary";
        }
    }

    console.log("Valor:", pedido.valorTotal);

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0 fw-bold">Pedido #{String(pedido.id).padStart(4, "0")}</h5>

                    <small className="text-light opacity-75">{pedido.clienteNome}</small>
                </div>

                <span className={`badge fs-6 ${badgeStatus(pedido.status)}`}>{pedido.status.replaceAll("_", " ")}</span>
            </div>

            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <div className="text-muted small">Cliente</div>

                        <div className="fs-4 fw-bold">{pedido.clienteNome}</div>
                    </div>

                    {mostrarValor && (
                        <div className="text-end">
                            <div className="text-muted small">Total</div>

                            <div className="fs-4 fw-bold text-success">
                                R{"$"}
                                {pedido.valorTotal?.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <hr />

                <h6 className="fw-bold mb-3">Itens</h6>

                <ul className="list-group mb-3">
                    {pedido.itens?.map((item, index) => (
                        <li key={index} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-semibold fs-5">
                                        {item.quantidade}x {item.produto}
                                    </div>

                                    <small className="text-muted">{item.categoria}</small>
                                </div>

                                <div className="mt-1">
                                    <span className="badge bg-secondary me-1">{item.setor}</span>

                                    <span className={`badge ${badgeStatus(item.statusOperacao)}`}>
                                        {item.statusOperacao.replaceAll("_", " ")}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {pedido.aguardaConferencia && (
                    <div className="alert alert-warning">
                        <strong>Atenção:</strong>
                        Todos os setores finalizaram a produção. Verifique os itens antes de continuar o pedido.
                    </div>
                )}

                {pedido.observacao && (
                    <div className="alert alert-info">
                        <strong>Observação do cliente</strong>

                        <hr className="my-2" />

                        {pedido.observacao}
                    </div>
                )}

                {pedido.observacaoOperacao && (
                    <div className="alert alert-warning">
                        <strong>Observação operacional</strong>

                        <hr className="my-2" />

                        {pedido.observacaoOperacao}
                    </div>
                )}

                <HistoricoPedido historico={pedido.historico} />

                {children}
            </div>
        </div>
    );
}

export default PedidoCard;
