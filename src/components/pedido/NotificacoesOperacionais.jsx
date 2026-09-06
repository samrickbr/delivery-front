import { useNavigate } from "react-router-dom";

import useNotificacoesOperacionais from "../../hooks/useNotificacoesOperacionais";

function NotificacoesOperacionais() {
    const navigate = useNavigate();
    const { notificacoes, dispensarNotificacao, removerDestaquePedidoPronto } = useNotificacoesOperacionais();

    function abrirPedido(notificacao) {
        dispensarNotificacao(notificacao.id);

        if (notificacao.tipo === "PEDIDO_PRONTO") {
            removerDestaquePedidoPronto(notificacao.pedidoId);
        }

        navigate("/balcao", {
            state: {
                pedidoId: notificacao.pedidoId,
                pedidoItemId: notificacao.pedidoItemId
            }
        });
    }

    return (
        <div className="notificacoes-operacionais" aria-live="polite">
            {notificacoes.map((notificacao) => {
                const pedidoPronto = notificacao.tipo === "PEDIDO_PRONTO";
                const itemFinalizado = notificacao.tipo === "PEDIDO_ITEM_FINALIZADO";

                return (
                    <div
                        key={notificacao.id}
                        className={`alert notificacao-operacional shadow ${
                            pedidoPronto ? "alert-danger notificacao-pedido-pronto" : itemFinalizado ? "alert-warning" : "alert-primary"
                        }`}
                        role="status"
                    >
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Dispensar notificação"
                            onClick={() => dispensarNotificacao(notificacao.id)}
                        />

                        <button
                            type="button"
                            className="btn btn-link p-0 text-start text-decoration-none text-reset w-100"
                            onClick={() => abrirPedido(notificacao)}
                        >
                            <div className="fw-bold">
                                {pedidoPronto ? "PEDIDO PRONTO" : itemFinalizado ? "ITEM FINALIZADO" : "NOVO PEDIDO"}
                            </div>
                            <div className="fs-5 fw-semibold">Pedido {notificacao.numeroPedido}</div>
                            {itemFinalizado && (
                                <div>
                                    <div>{notificacao.produto || `Item #${notificacao.pedidoItemId}`}</div>
                                    {notificacao.setor && <small>Setor: {notificacao.setor}</small>}
                                </div>
                            )}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default NotificacoesOperacionais;
