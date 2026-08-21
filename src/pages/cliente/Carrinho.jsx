import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function carregarCarrinhoInicial() {
    try {
        return JSON.parse(sessionStorage.getItem("carrinho")) || [];
    } catch {
        return [];
    }
}

function formatarValor(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function Carrinho() {
    const navigate = useNavigate();

    const [itens, setItens] = useState(carregarCarrinhoInicial);

    function atualizarCarrinho(novoCarrinho) {
        sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));

        setItens(novoCarrinho);

        window.dispatchEvent(new Event("carrinhoAtualizado"));
    }

    function removerProduto(id) {
        atualizarCarrinho(itens.filter((item) => item.id !== id));
    }

    function alterarQuantidade(id, quantidade) {
        const novaQuantidade = Number(quantidade);

        if (novaQuantidade < 1) {
            removerProduto(id);
            return;
        }

        atualizarCarrinho(
            itens.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantidade: novaQuantidade
                      }
                    : item
            )
        );
    }

    const quantidadeTotal = useMemo(
        () => itens.reduce((total, item) => total + Number(item.quantidade || 0), 0),
        [itens]
    );

    const total = useMemo(
        () => itens.reduce((soma, item) => soma + Number(item.preco || 0) * Number(item.quantidade || 0), 0),
        [itens]
    );

    function clienteAutenticado() {
        return Boolean(sessionStorage.getItem("clienteToken"));
    }

    return (
        <div className="pb-5">
            <section className="mb-4">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4 p-md-5">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div>
                                <span className="badge text-bg-primary rounded-pill mb-2">Seu pedido</span>

                                <h1 className="display-6 fw-bold mb-1">Seu carrinho</h1>

                                <p className="text-muted mb-0">Confira os produtos antes de continuar.</p>
                            </div>

                            <button
                                type="button"
                                className="btn btn-outline-primary rounded-pill px-4"
                                onClick={() => navigate("/cardapio")}
                            >
                                ← Voltar ao cardápio
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {itens.length === 0 ? (
                <div className="card border-0 shadow-sm">
                    <div className="card-body text-center py-5">
                        <div className="fs-1 mb-3" aria-hidden="true">
                            🛒
                        </div>

                        <h2 className="h4 mb-2">Seu carrinho está vazio</h2>

                        <p className="text-muted mb-4">Adicione alguns produtos do cardápio para começar seu pedido.</p>

                        <button
                            type="button"
                            className="btn btn-primary rounded-pill px-4"
                            onClick={() => navigate("/cardapio")}
                        >
                            Ver cardápio
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h5 mb-0">Produtos</h2>

                        <span className="text-muted small">
                            {quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"}
                        </span>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            {itens.map((item) => {
                                const quantidade = Number(item.quantidade || 0);

                                const subtotal = Number(item.preco || 0) * quantidade;

                                return (
                                    <article className="card border-0 shadow-sm mb-3" key={item.id}>
                                        <div className="card-body p-3 p-md-4">
                                            <div className="row g-3 align-items-center">
                                                <div className="col-12 col-sm-3 col-md-2">
                                                    {item.imagem ? (
                                                        <img
                                                            src={item.imagem}
                                                            alt={item.nome}
                                                            className="img-fluid rounded-3"
                                                            style={{
                                                                width: "100%",
                                                                height: "110px",
                                                                objectFit: "cover"
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="d-flex align-items-center justify-content-center bg-body-secondary rounded-3"
                                                            style={{
                                                                width: "100%",
                                                                height: "110px"
                                                            }}
                                                        >
                                                            <span className="fs-2" aria-hidden="true">
                                                                🍽️
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-12 col-sm-9 col-md-6">
                                                    <h3 className="h5 mb-1">{item.nome}</h3>

                                                    <p className="text-muted small mb-2">
                                                        {formatarValor(item.preco)} por unidade
                                                    </p>

                                                    <strong>Subtotal: {formatarValor(subtotal)}</strong>
                                                </div>

                                                <div className="col-12 col-md-4">
                                                    <div className="d-flex justify-content-md-end align-items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px"
                                                            }}
                                                            onClick={() => alterarQuantidade(item.id, quantidade - 1)}
                                                            aria-label={`Diminuir quantidade de ${item.nome}`}
                                                        >
                                                            −
                                                        </button>

                                                        <strong
                                                            className="text-center"
                                                            style={{
                                                                minWidth: "32px"
                                                            }}
                                                        >
                                                            {quantidade}
                                                        </strong>

                                                        <button
                                                            type="button"
                                                            className="btn btn-primary rounded-circle"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px"
                                                            }}
                                                            onClick={() => alterarQuantidade(item.id, quantidade + 1)}
                                                            aria-label={`Aumentar quantidade de ${item.nome}`}
                                                        >
                                                            +
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger rounded-pill ms-1"
                                                            onClick={() => removerProduto(item.id)}
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="col-12 col-lg-4">
                            <div
                                className="card border-0 shadow-sm sticky-lg-top"
                                style={{
                                    top: "1rem"
                                }}
                            >
                                <div className="card-body p-4">
                                    <h2 className="h4 mb-4">Resumo do pedido</h2>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Produtos</span>

                                        <strong>{formatarValor(total)}</strong>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Quantidade</span>

                                        <strong>{quantidadeTotal}</strong>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <strong className="fs-5">Total</strong>

                                        <strong className="fs-4 text-success">{formatarValor(total)}</strong>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-success btn-lg w-100 rounded-pill"
                                        onClick={() => navigate(clienteAutenticado() ? "/checkout" : "/identificacao")}
                                    >
                                        Continuar pedido
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-link w-100 mt-2"
                                        onClick={() => navigate("/cardapio")}
                                    >
                                        Continuar comprando
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Carrinho;
