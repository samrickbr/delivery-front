import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Cardapio() {
    const [produtos, setProdutos] = useState([]);
    const navigate = useNavigate();
    const [toast, setToast] = useState(false);

    async function carregarCardapio() {
        const response = await api.get("/api/delivery/cardapio");

        setProdutos(response.data);
    }

    useEffect(() => {
        carregarCardapio();
    }, []);

    useEffect(() => {
        const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];

        setQuantidadeCarrinho(carrinho.reduce((total, item) => total + item.quantidade, 0));
    }, []);

    function adicionarProduto(produto) {
        const carrinhoAtual = JSON.parse(sessionStorage.getItem("carrinho")) || [];

        const existente = carrinhoAtual.find((item) => item.id === produto.id);

        let novoCarrinho;

        if (existente) {
            novoCarrinho = carrinhoAtual.map((item) =>
                item.id === produto.id
                    ? {
                          ...item,
                          quantidade: item.quantidade + 1
                      }
                    : item
            );
        } else {
            novoCarrinho = [
                ...carrinhoAtual,
                {
                    ...produto,
                    quantidade: 1
                }
            ];
        }

        sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
        setQuantidadeCarrinho(novoCarrinho.reduce((total, item) => total + item.quantidade, 0));

        setToast(true);

        setTimeout(() => {
            setToast(false);
        }, 1800);
    }

    const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Cardápio</h1>

                <button className="btn btn-success" onClick={() => navigate("/carrinho")}>
                    🛒 Carrinho ({quantidadeCarrinho})
                </button>
            </div>

            <div className="row">
                {produtos.map((produto) => (
                    <div className="col-md-4 mb-3" key={produto.id}>
                        <div className="card shadow">
                            <div className="card-body">
                                <h5>{produto.nome}</h5>

                                <p>{produto.descricao}</p>

                                <strong>
                                    R${" "}
                                    {produto.preco.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2
                                    })}
                                </strong>

                                <br />

                                <button
                                    className="btn btn-primary mt-3 w-100"
                                    onClick={() => adicionarProduto(produto)}
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {toast && (
                <div className="toast show position-fixed bottom-0 end-0 m-4 text-bg-success" style={{ zIndex: 9999 }}>
                    <div className="toast-body">Produto adicionado ao carrinho.</div>
                </div>
            )}
        </div>
    );
}

export default Cardapio;
