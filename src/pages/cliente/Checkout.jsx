import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarPedido } from "../../services/pedidoService";

function Checkout() {
    const navigate = useNavigate();

    const clienteSessao = JSON.parse(sessionStorage.getItem("cliente") || "null");

    const carrinho = JSON.parse(sessionStorage.getItem("carrinho") || "[]");

    const [clienteNome, setClienteNome] = useState(clienteSessao?.nome || "");

    const [clienteWhatsapp, setClienteWhatsapp] = useState(clienteSessao?.telefone || "");

    const [observacao, setObservacao] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [pedidoCriado, setPedidoCriado] = useState(null);

    if (!clienteSessao) {
        navigate("/identificacao", { replace: true });
        return null;
    }

    function limparCarrinho() {
        sessionStorage.removeItem("carrinho");
    }

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

            const response = await criarPedido(pedido);

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
                    <h2>Pedido recebido!</h2>

                    <p>Seu pedido foi enviado para o balcão.</p>

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

                <div className="alert alert-success">
                    Cliente identificado: <strong>{clienteSessao.nome || clienteSessao.cpf}</strong>
                </div>

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
                    onChange={(event) => setClienteNome(event.target.value)}
                />

                <input
                    className="form-control mb-2"
                    placeholder="WhatsApp"
                    value={clienteWhatsapp}
                    onChange={(event) => setClienteWhatsapp(event.target.value)}
                />

                <textarea
                    className="form-control mb-3"
                    placeholder="Observação"
                    value={observacao}
                    onChange={(event) => setObservacao(event.target.value)}
                />

                <button
                    className="btn btn-success w-100"
                    disabled={enviando || !clienteNome || !clienteWhatsapp || carrinho.length === 0}
                    onClick={enviarPedido}
                >
                    {enviando ? "Enviando..." : "Enviar pedido"}
                </button>

                <button type="button" className="btn btn-link w-100 mt-2" onClick={() => navigate("/identificacao")}>
                    Alterar cliente
                </button>
            </div>
        </div>
    );
}

export default Checkout;
