import { useState } from "react";
import api from "../../services/api";

function Checkout({ carrinho, limparCarrinho }) {
    const [clienteNome, setClienteNome] = useState("");
    const [clienteWhatsapp, setClienteWhatsapp] = useState("");
    const [observacao, setObservacao] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [pedidoCriado, setPedidoCriado] = useState(null);

    async function enviarPedido() {
        const pedido = {
            clienteNome,
            clienteWhatsapp,
            observacao,
            itens: carrinho.map((item) => ({
                produtoId: item.id,
                quantidade: item.quantidade
            }))
        };

        try {
            setEnviando(true);

            await api.post("/pedidos", pedido);

            const response = await api.post("/pedidos", pedido);

            setPedidoCriado(response.data);

            limparCarrinho();

            setClienteNome("");
            setClienteWhatsapp("");
            setObservacao("");
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar pedido.");
        } finally {
            setEnviando(false);
        }
    }

    if (pedidoCriado) {
        return (
            <div className="card mt-4 shadow">
                <div className="card-body text-center">
                    <h2>Pedido recebido! 🎉</h2>

                    <p>Seu pedido foi enviado para a cozinha.</p>

                    <h3>Pedido #{pedidoCriado.id}</h3>

                    <p>Em breve você receberá atualizações.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card mt-4 shadow">
            <div className="card-body">
                <h3>Confirmar pedido</h3>

                <ul className="list-group mb-3">
                    {carrinho.map((item) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between">
                            <span>
                                {item.quantidade}x {item.nome}
                            </span>

                            <span>
                                R${" "}
                                {(item.preco * item.quantidade).toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2
                                })}
                            </span>
                        </li>
                    ))}
                </ul>

                <input
                    className="form-control mb-2"
                    placeholder="Nome"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                />

                <input
                    className="form-control mb-2"
                    placeholder="WhatsApp"
                    value={clienteWhatsapp}
                    onChange={(e) => setClienteWhatsapp(e.target.value)}
                />

                <textarea
                    className="form-control mb-3"
                    placeholder="Observação"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                />

                <button
                    className="btn btn-success"
                    disabled={enviando || !clienteNome || !clienteWhatsapp || carrinho.length === 0}
                    onClick={enviarPedido}
                >
                    {enviando ? "Enviando..." : "Enviar pedido"}
                </button>
            </div>
        </div>
    );
}

export default Checkout;
