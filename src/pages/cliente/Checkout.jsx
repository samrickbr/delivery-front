import { useMemo, useState } from "react";
import { criarPedido } from "../../services/pedidoService";

const FORMAS_PAGAMENTO = [
    {
        value: "PIX",
        label: "PIX"
    },
    {
        value: "CARTAO",
        label: "Cartão"
    },
    {
        value: "DINHEIRO",
        label: "Dinheiro"
    }
];

function formatarValor(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function Checkout() {
    const [clienteNome, setClienteNome] = useState("");
    const [clienteWhatsapp, setClienteWhatsapp] = useState("");
    const [observacao, setObservacao] = useState("");

    const [formaPagamento, setFormaPagamento] = useState("");

    const [precisaTroco, setPrecisaTroco] = useState(false);
    const [trocoPara, setTrocoPara] = useState("");

    const [enviando, setEnviando] = useState(false);
    const [pedidoCriado, setPedidoCriado] = useState(null);
    const [erro, setErro] = useState("");

    const [carrinho, setCarrinho] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem("carrinho")) || [];
        } catch {
            return [];
        }
    });

    const subtotal = useMemo(() => {
        return carrinho.reduce((total, item) => {
            return total + Number(item.preco || 0) * Number(item.quantidade || 0);
        }, 0);
    }, [carrinho]);

    function limparCarrinho() {
        sessionStorage.removeItem("carrinho");
        setCarrinho([]);
    }

    function selecionarFormaPagamento(forma) {
        setFormaPagamento(forma);
        setErro("");

        if (forma !== "DINHEIRO") {
            setPrecisaTroco(false);
            setTrocoPara("");
        }
    }

    function validarTroco() {
        if (formaPagamento !== "DINHEIRO" || !precisaTroco) {
            return true;
        }

        if (!trocoPara) {
            setErro("Informe para quanto precisa de troco.");
            return false;
        }

        const valorTroco = Number(trocoPara);

        if (!Number.isFinite(valorTroco) || valorTroco <= 0) {
            setErro("Informe um valor válido para o troco.");
            return false;
        }

        if (valorTroco < subtotal) {
            setErro(`O valor para troco deve ser igual ou maior que o total de ${formatarValor(subtotal)}.`);
            return false;
        }

        return true;
    }

    async function enviarPedido() {
        setErro("");

        if (carrinho.length === 0) {
            setErro("Seu carrinho está vazio.");
            return;
        }

        if (!clienteNome.trim()) {
            setErro("Informe seu nome.");
            return;
        }

        if (!clienteWhatsapp.trim()) {
            setErro("Informe seu WhatsApp.");
            return;
        }

        if (!formaPagamento) {
            setErro("Selecione uma forma de pagamento.");
            return;
        }

        if (!validarTroco()) {
            return;
        }

        if (enviando) {
            return;
        }

        const pedido = {
            clienteNome: clienteNome.trim(),
            clienteWhatsapp: clienteWhatsapp.trim(),
            observacao: observacao.trim(),
            formaPagamento,
            itens: carrinho.map((item) => ({
                produtoId: item.id,
                quantidade: item.quantidade
            }))
        };

        try {
            setEnviando(true);

            const response = await criarPedido(pedido);

            setPedidoCriado(response.data);

            limparCarrinho();
        } catch (error) {
            console.error(error);

            setErro(error?.response?.data?.message || "Não foi possível enviar o pedido. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    if (pedidoCriado) {
        return (
            <div className="card mt-4 shadow">
                <div className="card-body">
                    <div className="text-center">
                        <h2>Pedido recebido!</h2>

                        <p className="mb-3">Seu pedido foi enviado com sucesso.</p>

                        {pedidoCriado.id && <h3 className="mb-3">Pedido #{pedidoCriado.id}</h3>}

                        {pedidoCriado.status && (
                            <p className="mb-2">
                                <strong>Status:</strong> {pedidoCriado.status}
                            </p>
                        )}

                        {pedidoCriado.formaPagamento && (
                            <p className="mb-2">
                                <strong>Pagamento:</strong> {pedidoCriado.formaPagamento}
                            </p>
                        )}

                        {pedidoCriado.valorTotal !== undefined && (
                            <p className="mb-3">
                                <strong>Total:</strong> {formatarValor(pedidoCriado.valorTotal)}
                            </p>
                        )}

                        <p className="text-muted mb-0">Em breve você receberá atualizações sobre o pedido.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card mt-4 shadow">
            <div className="card-body">
                <h3 className="mb-4">Revisar pedido</h3>

                {erro && (
                    <div className="alert alert-danger" role="alert">
                        {erro}
                    </div>
                )}

                {/* Cliente */}
                <div className="mb-4">
                    <h5>Cliente</h5>

                    <input
                        className="form-control mb-2"
                        placeholder="Nome"
                        value={clienteNome}
                        onChange={(e) => setClienteNome(e.target.value)}
                        disabled={enviando}
                    />

                    <input
                        className="form-control"
                        placeholder="WhatsApp"
                        value={clienteWhatsapp}
                        onChange={(e) => setClienteWhatsapp(e.target.value)}
                        disabled={enviando}
                    />
                </div>

                {/* Pedido */}
                <div className="mb-4">
                    <h5>Pedido</h5>

                    {carrinho.length === 0 ? (
                        <div className="alert alert-warning">Seu carrinho está vazio.</div>
                    ) : (
                        <ul className="list-group mb-3">
                            {carrinho.map((item) => {
                                const valorItem = Number(item.preco || 0) * Number(item.quantidade || 0);

                                return (
                                    <li
                                        key={item.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <span>
                                            {item.quantidade}x {item.nome}
                                        </span>

                                        <strong>{formatarValor(valorItem)}</strong>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="d-flex justify-content-between">
                        <strong>Total</strong>

                        <strong>{formatarValor(subtotal)}</strong>
                    </div>
                </div>

                {/* Pagamento */}
                <div className="mb-4">
                    <h5>Forma de pagamento</h5>

                    <div className="d-grid gap-2">
                        {FORMAS_PAGAMENTO.map((forma) => (
                            <button
                                key={forma.value}
                                type="button"
                                className={
                                    formaPagamento === forma.value ? "btn btn-primary" : "btn btn-outline-primary"
                                }
                                onClick={() => selecionarFormaPagamento(forma.value)}
                                disabled={enviando}
                            >
                                {forma.label}
                            </button>
                        ))}
                    </div>

                    {formaPagamento === "DINHEIRO" && (
                        <div className="border rounded p-3 mt-3">
                            <h6>Troco</h6>

                            <div className="form-check mb-3">
                                <input
                                    id="precisaTroco"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={precisaTroco}
                                    onChange={(e) => {
                                        setPrecisaTroco(e.target.checked);

                                        if (!e.target.checked) {
                                            setTrocoPara("");
                                        }

                                        setErro("");
                                    }}
                                    disabled={enviando}
                                />

                                <label className="form-check-label" htmlFor="precisaTroco">
                                    Precisa de troco?
                                </label>
                            </div>

                            {precisaTroco && (
                                <div>
                                    <label className="form-label" htmlFor="trocoPara">
                                        Troco para quanto?
                                    </label>

                                    <input
                                        id="trocoPara"
                                        className="form-control"
                                        type="number"
                                        min={subtotal}
                                        step="0.01"
                                        placeholder={subtotal.toFixed(2)}
                                        value={trocoPara}
                                        onChange={(e) => {
                                            setTrocoPara(e.target.value);
                                            setErro("");
                                        }}
                                        disabled={enviando}
                                    />

                                    {trocoPara && Number(trocoPara) >= subtotal && (
                                        <small className="text-muted">
                                            Troco: {formatarValor(Number(trocoPara) - subtotal)}
                                        </small>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Observação */}
                <div className="mb-4">
                    <h5>Observação</h5>

                    <textarea
                        className="form-control"
                        placeholder="Observação do pedido (opcional)"
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        disabled={enviando}
                        rows={3}
                    />
                </div>

                {/* Revisão final */}
                <div className="border rounded p-3 mb-4">
                    <h5>Resumo final</h5>

                    <p className="mb-1">
                        <strong>Cliente:</strong> {clienteNome || "Não informado"}
                    </p>

                    <p className="mb-1">
                        <strong>WhatsApp:</strong> {clienteWhatsapp || "Não informado"}
                    </p>

                    <p className="mb-1">
                        <strong>Pagamento:</strong> {formaPagamento || "Não selecionado"}
                    </p>

                    {formaPagamento === "DINHEIRO" && precisaTroco && trocoPara && (
                        <p className="mb-1">
                            <strong>Troco para:</strong> {formatarValor(Number(trocoPara))}
                        </p>
                    )}

                    <p className="mb-0">
                        <strong>Total:</strong> {formatarValor(subtotal)}
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-success btn-lg w-100"
                    disabled={
                        enviando ||
                        !clienteNome.trim() ||
                        !clienteWhatsapp.trim() ||
                        !formaPagamento ||
                        carrinho.length === 0
                    }
                    onClick={enviarPedido}
                >
                    {enviando ? "Enviando pedido..." : "Confirmar pedido"}
                </button>
            </div>
        </div>
    );
}

export default Checkout;
