import { useState } from "react";
import { useNavigate } from "react-router-dom";

function carregarCarrinhoInicial() {
    return JSON.parse(sessionStorage.getItem("carrinho")) || [];
}

function Carrinho() {
    const [itens, setItens] = useState(carregarCarrinhoInicial);
    const navigate = useNavigate();

    function atualizarCarrinho(novoCarrinho) {
        sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
        setItens(novoCarrinho);
    }

    function removerProduto(id) {
        atualizarCarrinho(itens.filter((item) => item.id !== id));
    }

    function alterarQuantidade(id, quantidade) {
        if (quantidade < 1) {
            removerProduto(id);
            return;
        }

        atualizarCarrinho(
            itens.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantidade
                      }
                    : item
            )
        );
    }

    const total = itens.reduce(
        (soma, item) => soma + Number(item.preco) * item.quantidade,
        0
    );

    return (
        <div className="container mt-3 mt-md-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <h1 className="mb-0">Carrinho</h1>

                <button className="btn btn-outline-primary" onClick={() => navigate("/cardapio")}>
                    Voltar ao cardápio
                </button>
            </div>

            {itens.length === 0 ? (
                <div className="alert alert-secondary">
                    <p className="mb-3">Seu carrinho está vazio.</p>

                    <button className="btn btn-primary" onClick={() => navigate("/cardapio")}>
                        Ver cardápio
                    </button>
                </div>
            ) : (
                <>
                    {itens.map((item) => {
                        const subtotal = Number(item.preco) * item.quantidade;

                        return (
                            <div className="card mb-3" key={item.id}>
                                <div className="card-body">
                                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                                        <div>
                                            <h5 className="mb-1">{item.nome}</h5>

                                            <span className="text-muted">
                                                R${" "}
                                                {Number(item.preco).toLocaleString("pt-BR", {
                                                    minimumFractionDigits: 2
                                                })}{" "}
                                                por unidade
                                            </span>
                                        </div>

                                        <strong>
                                            Subtotal: R${" "}
                                            {subtotal.toLocaleString("pt-BR", {
                                                minimumFractionDigits: 2
                                            })}
                                        </strong>
                                    </div>

                                    <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                                        <span className="me-2">Quantidade:</span>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}
                                            aria-label={`Diminuir quantidade de ${item.nome}`}
                                        >
                                            −
                                        </button>

                                        <strong className="px-2" style={{ minWidth: "32px", textAlign: "center" }}>
                                            {item.quantidade}
                                        </strong>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}
                                            aria-label={`Aumentar quantidade de ${item.nome}`}
                                        >
                                            +
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger ms-sm-2"
                                            onClick={() => removerProduto(item.id)}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="mb-0">Total</h3>

                        <h3 className="mb-0">
                            R${" "}
                            {total.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2
                            })}
                        </h3>
                    </div>

                    <button className="btn btn-success w-100" onClick={() => navigate("/identificacao")}>
                        Continuar
                    </button>
                </>
            )}
        </div>
    );
}

export default Carrinho;