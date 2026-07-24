function PedidoCard({ pedido, children }) {
    return (
        <div className="card shadow mb-4 border-0">
            <div className="card-header bg-dark text-white">
                <h4 className="mb-0">Pedido #{pedido.id}</h4>
            </div>

            <div className="card-body">
                <h5>{pedido.clienteNome}</h5>

                <p>
                    <strong>Status:</strong>{" "}
                    <span
                        className={
                            pedido.status === "APROVADO"
                                ? "badge bg-warning text-dark"
                                : pedido.status === "EM_PRODUCAO"
                                  ? "badge bg-primary"
                                  : pedido.status === "PENDENTE"
                                    ? "badge bg-danger"
                                    : pedido.status === "FINALIZADO"
                                      ? "badge bg-success"
                                      : pedido.status === "ENTREGUE"
                                        ? "badge bg-success"
                                        : pedido.status === "CANCELADO"
                                          ? "badge bg-dark"
                                          : pedido.status === "SAIU_ENTREGA"
                                            ? "badge bg-info"
                                            : "badge bg-secondary"
                        }
                    >
                        {pedido.status}
                    </span>
                </p>

                <hr />

                <strong>Itens</strong>

                <ul className="list-group mb-3 mt-2">
                    {pedido.itens?.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between">
                            <span>
                                {item.quantidade}x {item.produto}
                            </span>

                            <span className="badge bg-secondary">{item.categoria}</span>
                        </li>
                    ))}
                </ul>

                {pedido.observacao && (
                    <div className="alert alert-info">
                        <strong>Cliente</strong>
                        <br />
                        {pedido.observacao}
                    </div>
                )}

                {pedido.observacaoOperacao && (
                    <div className="alert alert-warning">
                        <strong>Operação</strong>
                        <br />
                        {pedido.observacaoOperacao}
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}

export default PedidoCard;
