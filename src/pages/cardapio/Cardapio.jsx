import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Cardapio() {
    const [produtos, setProdutos] = useState([]);
    const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0);
    const [erro, setErro] = useState(false);
    const [toast, setToast] = useState(false);

    const toastTimer = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function carregarDados() {
            try {
                const response = await api.get("/produtos/cardapio");

                setProdutos(response.data);

                const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];

                setQuantidadeCarrinho(carrinho.reduce((total, item) => total + item.quantidade, 0));
            } catch (error) {
                console.error("Erro ao carregar cardápio.", error);
                setErro(true);
            }
        }

        carregarDados();
    }, []);

    function atualizarCarrinho() {
        const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];

        setQuantidadeCarrinho(carrinho.reduce((total, item) => total + item.quantidade, 0));
    }

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

        atualizarCarrinho();

        setToast(true);

        clearTimeout(toastTimer.current);

        toastTimer.current = setTimeout(() => {
            setToast(false);
        }, 1800);
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Cardápio</h1>

                <button className="btn btn-success" onClick={() => navigate("/carrinho")}>
                    🛒 Carrinho ({quantidadeCarrinho})
                </button>
            </div>

            {erro ? (
                <div className="alert alert-danger">Não foi possível carregar o cardápio.</div>
            ) : produtos.length === 0 ? (
                <div className="alert alert-secondary">Nenhum produto disponível.</div>
            ) : (
                <div className="row">
                    {produtos.map((produto) => (
                        <div className="col-md-4 mb-3" key={produto.id}>
                            <div className="card shadow h-100">
                                {produto.imagem && (
                                    <img src={produto.imagem} className="card-img-top" alt={produto.nome} />
                                )}

                                <div className="card-body d-flex flex-column">
                                    <h5>{produto.nome}</h5>

                                    {produto.descricao && <p>{produto.descricao}</p>}

                                    <strong>
                                        R${" "}
                                        {produto.preco.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2
                                        })}
                                    </strong>

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
            )}

            {toast && (
                <div
                    className="toast show position-fixed bottom-0 end-0 m-4 text-bg-success"
                    style={{
                        zIndex: 9999
                    }}
                >
                    <div className="toast-body">Produto adicionado ao carrinho.</div>
                </div>
            )}
        </div>
    );
}

export default Cardapio;
