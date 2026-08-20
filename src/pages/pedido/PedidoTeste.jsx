import { useEffect, useState } from "react";
import api from "../../services/api";

function PedidoTeste() {
    const [produtos, setProdutos] = useState([]);
    const [clienteNome, setClienteNome] = useState("");
    const [observacao, setObservacao] = useState("");
    const [produtoId, setProdutoId] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const [itens, setItens] = useState([]);
    const [clienteWhatsapp, setClienteWhatsapp] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            const response = await api.get("/produtos");

            if (ativo) {
                setProdutos(response.data);
            }
        }

        carregar();

        return () => {
            ativo = false;
        };
    }, []);

    function adicionarItem() {
        const produto = produtos.find((p) => p.id === Number(produtoId));

        if (!produto) return;

        setItens([
            ...itens,
            {
                produtoId: produto.id,
                nome: produto.nome,
                quantidade: Number(quantidade)
            }
        ]);

        setProdutoId("");
        setQuantidade(1);
    }

    function removerItem(index) {
        setItens(itens.filter((_, i) => i !== index));
    }

    async function criarPedido() {
        const pedido = {
            clienteNome,
            clienteWhatsapp,
            observacao,
            itens: itens.map((item) => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade
            }))
        };

        try {
            const response = await api.post("/pedidos", pedido);

            console.log("RESPOSTA:", response.data);

            alert("Pedido criado com sucesso!");
        } catch (error) {
            console.error("ERRO:", error);
            alert("Erro ao criar pedido");
        }
    }

    return (
        <div className="container mt-4">
            <h1>Novo Pedido (Teste)</h1>

            <div className="mb-3">
                <label>Cliente</label>
                <input className="form-control" value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} />
            </div>

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="WhatsApp"
                    value={clienteWhatsapp}
                    onChange={(e) => setClienteWhatsapp(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label>Observação</label>
                <textarea className="form-control" value={observacao} onChange={(e) => setObservacao(e.target.value)} />
            </div>

            <hr />

            <h4>Adicionar Item</h4>

            <div className="row">
                <div className="col-md-6">
                    <select className="form-select" value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
                        <option value="">Selecione o produto</option>

                        {produtos.map((produto) => (
                            <option key={produto.id} value={produto.id}>
                                {produto.nome} - R$ {produto.preco}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-2">
                    <input
                        type="number"
                        className="form-control"
                        value={quantidade}
                        min="1"
                        onChange={(e) => setQuantidade(e.target.value)}
                    />
                </div>

                <div className="col-md-2">
                    <button className="btn btn-primary" onClick={adicionarItem}>
                        Adicionar
                    </button>
                </div>
            </div>

            <hr />

            <h4>Itens</h4>

            <ul className="list-group">
                {itens.map((item, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between">
                        {item.quantidade}x {item.nome}
                        <button className="btn btn-sm btn-danger" onClick={() => removerItem(index)}>
                            X
                        </button>
                    </li>
                ))}
            </ul>

            <button
                className="btn btn-success mt-4"
                disabled={!clienteNome || itens.length === 0}
                onClick={criarPedido}
            >
                Criar Pedido
            </button>
        </div>
    );
}

export default PedidoTeste;
