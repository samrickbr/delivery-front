import { useState } from "react";
import { criarPedido } from "../../services/pedidoService";

function carregarCarrinhoInicial() {
    return JSON.parse(sessionStorage.getItem("carrinho")) || [];
}

function Checkout() {
    const [clienteNome, setClienteNome] = useState("");
    const [clienteWhatsapp, setClienteWhatsapp] = useState("");
    const [observacao, setObservacao] = useState("");

    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");
    const [pedidoCriado, setPedidoCriado] = useState(null);

    const [carrinho, setCarrinho] = useState(carregarCarrinhoInicial);

    function limparCarrinho() {
        sessionStorage.removeItem("carrinho");
        setCarrinho([]);
    }

    async function enviarPedido() {
        const nome = clienteNome.trim();
        const whatsapp = clienteWhatsapp.trim();

        if (!nome || !whatsapp || carrinho.length === 0) {
            return;
        }

        const pedido = {
            clienteNome: nome,
            clienteWhatsapp: whatsapp,
            observacao: observacao.trim(),
            itens: carrinho.map((item) => ({
                produtoId: item.id,
                quantidade: item.quantidade
            }))
        };

        try {
            setEnviando(true);
            setErro("");

            const response = await criarPedido(pedido);

            setPedidoCriado(response.data);

            limparCarrinho();

            setClienteNome("");
            setClienteWhatsapp("");
            setObservacao("");
        } catch (error) {
            console.error("Erro ao enviar pedido.", error);

            setErro("Não foi possível enviar o pedido. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    if (pedidoCriado) {
        return (
            <div className="container mt-3 mt-md-4">
                <div className="card shadow">
                    <div className="card-body text-center py-5">
                        <h2>Pedido recebido!</h2>

                        <p className="mb-3">Seu pedido foi enviado com sucesso.</p>

                        <h3>Pedido #{pedidoCriado.id}</h3>

                        <p className="mb-0 text-muted">Em breve você receberá atualizações.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (carrinho.length === 0) {
        return (
            <div className="container mt-3 mt-md-4">
                <div className="alert alert-secondary">Seu carrinho está vazio.</div>
            </div>
        );
    }

    const total = carrinho.reduce((soma, item) => soma + Number(item.preco) * item.quantidade, 0);

    return (
        <div className="container mt-3 mt-md-4 mb-4">
            <div className="card shadow">
                <div className="card-body">
                    <h3 className="mb-4">Confirmar pedido</h3>

                    <h5>Itens do pedido</h5>

                    <ul className="list-group mb-4">
                        {carrinho.map((item) => (
                            <li
                                key={item.id}
                                className="list-group-item d-flex flex-column flex-sm-row justify-content-between gap-2"
                            >
                                <span>
                                    {item.quantidade}x {item.nome}
                                </span>

                                <span>
                                    R${" "}
                                    {(Number(item.preco) * item.quantidade).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2
                                    })}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex justify-content-between mb-4">
                        <strong>Total</strong>

                        <strong>
                            R${" "}
                            {total.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2
                            })}
                        </strong>
                    </div>

                    <h5>Seus dados</h5>

                    {erro && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {erro}
                        </div>
                    )}

                    <label className="form-label mt-3" htmlFor="clienteNome">
                        Nome
                    </label>

                    <input
                        id="clienteNome"
                        className="form-control mb-2"
                        placeholder="Seu nome"
                        value={clienteNome}
                        onChange={(e) => setClienteNome(e.target.value)}
                        autoComplete="name"
                    />

                    <label className="form-label" htmlFor="clienteWhatsapp">
                        WhatsApp
                    </label>

                    <input
                        id="clienteWhatsapp"
                        className="form-control mb-2"
                        placeholder="Seu WhatsApp"
                        value={clienteWhatsapp}
                        onChange={(e) => setClienteWhatsapp(e.target.value)}
                        inputMode="tel"
                        autoComplete="tel"
                    />

                    <label className="form-label" htmlFor="observacao">
                        Observação
                    </label>

                    <textarea
                        id="observacao"
                        className="form-control mb-3"
                        rows="3"
                        placeholder="Observação (opcional)"
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                    />

                    <button
                        className="btn btn-success w-100"
                        disabled={enviando || !clienteNome.trim() || !clienteWhatsapp.trim()}
                        onClick={enviarPedido}
                    >
                        {enviando ? "Enviando pedido..." : "Confirmar pedido"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
