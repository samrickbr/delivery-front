import HistoricoPedido from "./HistoricoPedido";
import { obterNumeroPedido } from "../../utils/pedidoUtils";

function PedidoCard({ pedido, children, mostrarValor = true }) {
    function badgeStatus(status) {
        switch (status) {
            case "RECEBIDO":
                return "bg-primary";

            case "APROVADO":
                return "bg-warning text-dark";

            case "AGUARDANDO_PRODUCAO":
                return "bg-warning text-dark";

            case "EM_PRODUCAO":
                return "bg-primary";

            case "PENDENTE":
                return "bg-danger";

            case "FINALIZADO":
                return "bg-success";

            case "AGUARDANDO_SEPARACAO":
                return "bg-info text-dark";

            case "SEPARADO":
                return "bg-info text-dark";

            case "SAIU_ENTREGA":
                return "bg-info text-dark";

            case "ENTREGUE":
                return "bg-success";

            case "FATURADO":
                return "bg-success";

            case "CANCELADO":
                return "bg-dark";

            default:
                return "bg-secondary";
        }
    }

    function formatarStatus(status) {
        if (!status) {
            return "-";
        }

        return status.replaceAll("_", " ");
    }

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0 fw-bold">Pedido {obterNumeroPedido(pedido)}</h5>

                    {pedido.clienteNome && <small className="text-light opacity-75">{pedido.clienteNome}</small>}
                </div>

                <span className={`badge fs-6 ${badgeStatus(pedido.status)}`}>{formatarStatus(pedido.status)}</span>
            </div>

            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <div className="text-muted small">Cliente</div>

                        <div className="fs-4 fw-bold">{pedido.clienteNome || "-"}</div>
                    </div>

                    {mostrarValor && (
                        <div className="text-end">
                            <div className="text-muted small">Total</div>

                            <div className="fs-4 fw-bold text-success">
                                R$
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
                    {pedido.itens?.map((item) => (
                        <li key={item.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-semibold fs-5">
                                        {item.quantidade}x {item.produto}
                                    </div>

                                    {item.categoria && <small className="text-muted">{item.categoria}</small>}
                                </div>

                                <div className="mt-1 text-end">
                                    {item.setor && <span className="badge bg-secondary me-1">{item.setor}</span>}

                                    {item.statusOperacao && (
                                        <span className={`badge ${badgeStatus(item.statusOperacao)}`}>
                                            {formatarStatus(item.statusOperacao)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                {pedido.aguardaConferencia && (
                    <div className="alert alert-warning">
                        <strong>Atenção:</strong> Todos os setores finalizaram a produção. Verifique os itens antes de
                        continuar o pedido.
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
