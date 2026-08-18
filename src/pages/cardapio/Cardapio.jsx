import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Cardapio() {
    const [produtos, setProdutos] = useState([]);
    const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(() => {
        const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];

        return carrinho.reduce((total, item) => total + item.quantidade, 0);
    });
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const [toast, setToast] = useState(false);

    const toastTimer = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function carregarCardapio() {
            try {
                const response = await api.get("/produtos/cardapio");

                setProdutos(response.data);
            } catch (error) {
                console.error("Erro ao carregar cardápio.", error);
                setErro(true);
            } finally {
                setCarregando(false);
            }
        }

        carregarCardapio();
    }, []);

    useEffect(() => {
        return () => {
            clearTimeout(toastTimer.current);
        };
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

    function obterCategoria(produto) {
        if (!produto.categoria) {
            return null;
        }

        if (typeof produto.categoria === "string") {
            return produto.categoria;
        }

        return produto.categoria.nome || produto.categoria.nomeCategoria || null;
    }

    return (
        <div className="container mt-3 mt-md-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <h1 className="mb-0">Cardápio</h1>

                <button className="btn btn-success w-100 w-sm-auto" onClick={() => navigate("/carrinho")}>
                    🛒 Carrinho ({quantidadeCarrinho})
                </button>
            </div>

            {carregando ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" aria-label="Carregando cardápio" />
                    <p className="mt-3 mb-0">Carregando cardápio...</p>
                </div>
            ) : erro ? (
                <div className="alert alert-danger">Não foi possível carregar o cardápio.</div>
            ) : produtos.length === 0 ? (
                <div className="alert alert-secondary">Nenhum produto disponível.</div>
            ) : (
                <div className="row g-3">
                    {produtos.map((produto) => {
                        const categoria = obterCategoria(produto);

                        return (
                            <div className="col-12 col-sm-6 col-md-4" key={produto.id}>
                                <div className="card shadow-sm h-100">
                                    {produto.imagem && (
                                        <img src={produto.imagem} className="card-img-top" alt={produto.nome} />
                                    )}

                                    <div className="card-body d-flex flex-column">
                                        {categoria && <small className="text-muted mb-1">{categoria}</small>}

                                        <h5 className="card-title">{produto.nome}</h5>

                                        {produto.descricao && <p className="card-text">{produto.descricao}</p>}

                                        <strong className="fs-5 mt-auto">
                                            R${" "}
                                            {Number(produto.preco).toLocaleString("pt-BR", {
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
                        );
                    })}
                </div>
            )}

            {toast && (
                <div className="toast show position-fixed bottom-0 end-0 m-3" style={{ zIndex: 9999 }} role="status">
                    <div className="toast-body text-bg-success">Produto adicionado ao carrinho.</div>
                </div>
            )}
        </div>
    );
}

export default Cardapio;
