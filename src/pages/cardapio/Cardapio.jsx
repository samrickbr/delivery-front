import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import { formatarValor, obterCategoria, obterCategorias } from "./cardapioUtils";

import { useCardapioCarrinho } from "./hooks/useCardapioCarrinho";

function Cardapio() {
    const navigate = useNavigate();
    const toastTimer = useRef(null);

    const [produtos, setProdutos] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("TODOS");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [produtoAdicionado, setProdutoAdicionado] = useState(null);

    const { quantidadeCarrinho, adicionarProduto, diminuirProduto, obterQuantidadeProduto } = useCardapioCarrinho();

    useEffect(() => {
        async function carregarCardapio() {
            try {
                setErro("");

                const response = await api.get("/produtos/cardapio");

                setProdutos(response.data || []);
            } catch (error) {
                console.error("Erro ao carregar cardápio.", error);
                setErro("Não foi possível carregar o cardápio.");
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

    const categorias = useMemo(() => obterCategorias(produtos), [produtos]);

    const produtosFiltrados = useMemo(() => {
        if (categoriaSelecionada === "TODOS") {
            return produtos;
        }

        return produtos.filter((produto) => obterCategoria(produto) === categoriaSelecionada);
    }, [produtos, categoriaSelecionada]);

    function handleAdicionar(produto) {
        adicionarProduto(produto);

        setProdutoAdicionado(produto);

        clearTimeout(toastTimer.current);

        toastTimer.current = setTimeout(() => {
            setProdutoAdicionado(null);
        }, 1800);
    }

    return (
        <div className="pb-5">
            <section className="mb-4">
                <div className="card border-0 shadow-sm overflow-hidden">
                    <div className="card-body p-4 p-md-5">
                        <div className="row align-items-center g-4">
                            <div className="col-12 col-lg-8">
                                <span className="badge text-bg-primary rounded-pill mb-3">Nosso cardápio</span>

                                <h1 className="display-6 fw-bold mb-2">Escolha seus favoritos</h1>

                                <p className="lead text-muted mb-0">
                                    Produtos preparados para você. Monte seu pedido e finalize quando estiver pronto.
                                </p>
                            </div>

                            <div className="col-12 col-lg-4 text-lg-end">
                                <button
                                    type="button"
                                    className="btn btn-success btn-lg rounded-pill px-4"
                                    onClick={() => navigate("/carrinho")}
                                >
                                    <span aria-hidden="true">🛒</span>

                                    <span className="ms-2">Meu carrinho</span>

                                    <span className="ms-2 badge text-bg-light">{quantidadeCarrinho}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {!carregando && !erro && categorias.length > 1 && (
                <section className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h2 className="h5 mb-0">Categorias</h2>
                    </div>

                    <div className="d-flex gap-2 overflow-auto pb-2">
                        {categorias.map((categoria) => {
                            const selecionada = categoriaSelecionada === categoria;

                            return (
                                <button
                                    key={categoria}
                                    type="button"
                                    className={
                                        selecionada
                                            ? "btn btn-primary rounded-pill flex-shrink-0 px-4"
                                            : "btn btn-outline-secondary rounded-pill flex-shrink-0 px-4"
                                    }
                                    onClick={() => setCategoriaSelecionada(categoria)}
                                >
                                    {categoria === "TODOS" ? "Todos" : categoria}
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}

            {carregando ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary" role="status" aria-label="Carregando cardápio" />

                        <p className="text-muted mt-3 mb-0">Carregando cardápio...</p>
                    </div>
                </div>
            ) : erro ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="fs-1 mb-3">⚠️</div>

                        <h2 className="h4">Não foi possível carregar o cardápio</h2>

                        <p className="text-muted">Verifique sua conexão e tente novamente.</p>

                        <button
                            type="button"
                            className="btn btn-primary rounded-pill px-4"
                            onClick={() => window.location.reload()}
                        >
                            Tentar novamente
                        </button>
                    </div>
                </div>
            ) : produtos.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="fs-1 mb-3">🍽️</div>

                        <h2 className="h4">Cardápio indisponível</h2>

                        <p className="text-muted mb-0">Nenhum produto está disponível no momento.</p>
                    </div>
                </div>
            ) : produtosFiltrados.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="fs-1 mb-3">🍽️</div>

                        <h2 className="h4">Nenhum produto encontrado</h2>

                        <p className="text-muted mb-0">Não encontramos produtos nesta categoria.</p>
                    </div>
                </div>
            ) : (
                <section>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h2 className="h4 mb-0">
                            {categoriaSelecionada === "TODOS" ? "Produtos" : categoriaSelecionada}
                        </h2>

                        <span className="text-muted small">
                            {produtosFiltrados.length} {produtosFiltrados.length === 1 ? "produto" : "produtos"}
                        </span>
                    </div>

                    <div className="row g-3 g-md-4">
                        {produtosFiltrados.map((produto) => {
                            const categoria = obterCategoria(produto);

                            const quantidade = obterQuantidadeProduto(produto.id);

                            return (
                                <div className="col-12 col-sm-6 col-lg-4" key={produto.id}>
                                    <article className="card border-0 shadow-sm h-100 overflow-hidden">
                                        {produto.imagem ? (
                                            <img
                                                src={produto.imagem}
                                                className="card-img-top"
                                                alt={produto.nome}
                                                style={{
                                                    height: "230px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="d-flex align-items-center justify-content-center bg-body-secondary"
                                                style={{
                                                    height: "230px"
                                                }}
                                            >
                                                <span className="fs-1" aria-hidden="true">
                                                    🍽️
                                                </span>
                                            </div>
                                        )}

                                        <div className="card-body d-flex flex-column p-4">
                                            {categoria && <span className="small text-muted mb-1">{categoria}</span>}

                                            <h3 className="h5 fw-semibold mb-2">{produto.nome}</h3>

                                            {produto.descricao && (
                                                <p className="text-muted mb-4">{produto.descricao}</p>
                                            )}

                                            <div className="mt-auto">
                                                <div className="d-flex align-items-center justify-content-between gap-3">
                                                    <strong className="fs-5">{formatarValor(produto.preco)}</strong>

                                                    {quantidade === 0 ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary rounded-pill px-3"
                                                            onClick={() => handleAdicionar(produto)}
                                                        >
                                                            + Adicionar
                                                        </button>
                                                    ) : (
                                                        <div
                                                            className="d-flex align-items-center gap-2"
                                                            aria-label={`Quantidade de ${produto.nome}`}
                                                        >
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary rounded-circle"
                                                                style={{
                                                                    width: "38px",
                                                                    height: "38px"
                                                                }}
                                                                onClick={() => diminuirProduto(produto)}
                                                                aria-label={`Diminuir ${produto.nome}`}
                                                            >
                                                                −
                                                            </button>

                                                            <strong
                                                                className="text-center"
                                                                style={{
                                                                    minWidth: "24px"
                                                                }}
                                                            >
                                                                {quantidade}
                                                            </strong>

                                                            <button
                                                                type="button"
                                                                className="btn btn-primary rounded-circle"
                                                                style={{
                                                                    width: "38px",
                                                                    height: "38px"
                                                                }}
                                                                onClick={() => handleAdicionar(produto)}
                                                                aria-label={`Adicionar mais ${produto.nome}`}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {produtoAdicionado && (
                <div className="toast show position-fixed bottom-0 end-0 m-3" style={{ zIndex: 9999 }} role="status">
                    <div className="toast-body text-bg-success rounded">
                        <strong>{produtoAdicionado.nome}</strong> adicionado ao carrinho.
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cardapio;
