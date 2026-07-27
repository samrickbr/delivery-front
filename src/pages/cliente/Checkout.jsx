import { useEffect, useState } from "react";
import { criarPedido } from "../../services/pedidoService";

function Checkout() {
    // ============================
    // Dados do cliente
    // ============================
    const [clienteNome, setClienteNome] = useState("");
    const [clienteWhatsapp, setClienteWhatsapp] = useState("");
    const [observacao, setObservacao] = useState("");

    // ============================
    // Controle da tela
    // ============================
    const [enviando, setEnviando] = useState(false);
    const [pedidoCriado, setPedidoCriado] = useState(null);

    // ============================
    // Carrinho vindo do sessionStorage
    // ============================
    const [carrinho, setCarrinho] = useState([]);

    // Carrega carrinho ao abrir checkout
    useEffect(() => {
        const itens = JSON.parse(sessionStorage.getItem("carrinho")) || [];

        setCarrinho(itens);
    }, []);

    // ============================
    // Limpa carrinho após finalizar pedido
    // ============================
    function limparCarrinho() {
        sessionStorage.removeItem("carrinho");

        setCarrinho([]);
    }

    // ============================
    // Envia pedido para o backend
    // Endpoint:
    // POST /pedidos
    // ============================
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

            // Guarda retorno para mostrar confirmação
            setPedidoCriado(response.data);

            // Limpa carrinho
            limparCarrinho();

            // Limpa formulário
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

    // ============================
    // Tela após pedido criado
    // ============================
    if (pedidoCriado) {
        return (
            <div className="card mt-4 shadow">
                <div className="card-body text-center">
                    <h2>Pedido recebido! 🎉</h2>

                    <p>Seu pedido foi enviado para o balcão.</p>

                    <h3>Pedido #{pedidoCriado.id}</h3>

                    <p>Em breve você receberá atualizações.</p>
                </div>
            </div>
        );
    }

    // ============================
    // Formulário checkout
    // ============================
    return (
        <div className="card mt-4 shadow">
            <div className="card-body">
                <h3>Confirmar pedido</h3>

                {/* Resumo dos itens */}
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

                {/* Dados cliente */}

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

                {/* Envio pedido */}

                <button
                    className="btn btn-success w-100"

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
