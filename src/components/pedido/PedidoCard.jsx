import HistoricoPedido from "./HistoricoPedido";
import { obterNumeroPedido } from "../../utils/pedidoUtils";

function PedidoCard({
    pedido,
    children,
    mostrarValor = true,
    pedidoItemEmDestaqueId,
    renderizarAcoesItem,
    renderizarCheckboxItem,
    ocultarStatusOperacaoBalcao = false,
    pedidoPronto = false
}) {
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
                return "bg-danger";

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

    function formatarTipoRecebimento(tipo) {
        if (!tipo) {
            return null;
        }

        const normalizado = tipo.toUpperCase();

        if (normalizado === "ENTREGA") {
            return "🚚 ENTREGA";
        }

        if (normalizado === "RETIRADA") {
            return "🛍️ RETIRADA";
        }

        return tipo;
    }

    function formatarEndereco(endereco) {
        if (!endereco || typeof endereco !== "object") {
            return null;
        }

        const linhaPrincipal = [endereco.logradouro || endereco.rua, endereco.numero].filter(Boolean).join(", ");

        const linhaSecundaria = [endereco.bairro, endereco.cidade, endereco.uf].filter(Boolean).join(" - ");

        const partes = [linhaPrincipal, linhaSecundaria, endereco.complemento].filter(Boolean);

        return partes.length > 0 ? partes.join(" • ") : null;
    }

    const tipoRecebimento = formatarTipoRecebimento(pedido.tipoRecebimento);

    const enderecoFormatado = formatarEndereco(pedido.endereco);

    return (
        <div className={`card shadow-sm border-0 mb-4 ${pedidoPronto ? "pedido-pronto-destaque" : ""}`}>
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center gap-3">
                <div>
                    <h5 className="mb-0 fw-bold">Pedido {obterNumeroPedido(pedido)}</h5>

                    {pedido.clienteNome && <small className="text-light opacity-75">{pedido.clienteNome}</small>}
                </div>

                <span className={`badge fs-6 ${badgeStatus(pedido.status)}`}>{formatarStatus(pedido.status)}</span>
            </div>

            <div className="card-body">
                {/* RESUMO DO PEDIDO */}
                <div className="border rounded p-2 mb-3 bg-light">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        {pedido.clienteNome && (
                            <div>
                                <span className="text-muted small d-block">Cliente</span>

                                <strong>{pedido.clienteNome}</strong>
                            </div>
                        )}

                        {tipoRecebimento && (
                            <div>
                                <span className="text-muted small d-block">Recebimento</span>

                                <strong>{tipoRecebimento}</strong>
                            </div>
                        )}

                        {pedido.formaPagamento && (
                            <div>
                                <span className="text-muted small d-block">Pagamento</span>

                                <strong>{pedido.formaPagamento}</strong>
                            </div>
                        )}

                        {mostrarValor && (
                            <div className="ms-auto text-end">
                                <span className="text-muted small d-block">Total</span>

                                <strong className="text-success">
                                    R${" "}
                                    {Number(pedido.valorTotal || 0).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2
                                    })}
                                </strong>
                            </div>
                        )}
                    </div>

                    {enderecoFormatado && <div className="small text-muted mt-2">📍 {enderecoFormatado}</div>}
                </div>

                <h6 className="fw-bold mb-3">Itens</h6>

                <ul className="list-group mb-3">
                    {pedido.itens?.map((item) => {
                        const itemBalcao = item.setor?.toUpperCase() === "BALCAO";

                        const ocultarStatus = ocultarStatusOperacaoBalcao && itemBalcao;

                        return (
                            <li
                                key={item.id}
                                className={`list-group-item ${
                                    Number(item.id) === Number(pedidoItemEmDestaqueId) ? "pedido-item-direcionado" : ""
                                } ${item.statusOperacao === "CANCELADO" ? "border-danger bg-danger-subtle" : ""}`}
                            >
                                <div className="d-flex justify-content-between align-items-center gap-3">
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold fs-5">
                                            {item.quantidade}x {item.produto}
                                        </div>

                                        {item.categoria && <small className="text-muted">{item.categoria}</small>}
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        {item.setor && <span className="badge bg-secondary">{item.setor}</span>}

                                        {!ocultarStatus && item.statusOperacao && (
                                            <span className={`badge ${badgeStatus(item.statusOperacao)}`}>
                                                {formatarStatus(item.statusOperacao)}
                                            </span>
                                        )}

                                        {renderizarCheckboxItem?.(item)}
                                    </div>
                                </div>

                                {renderizarAcoesItem?.(item)}
                            </li>
                        );
                    })}
                </ul>

                {pedido.observacao && (
                    <div className="alert alert-info py-2">
                        <strong>Observação do cliente</strong>

                        <hr className="my-2" />

                        {pedido.observacao}
                    </div>
                )}

                {pedido.observacaoOperacao && (
                    <div className="alert alert-warning py-2">
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
