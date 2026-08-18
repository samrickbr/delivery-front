import { useState } from "react";
import { useNavigate } from "react-router-dom";

function carregarCarrinhoInicial() {
    return JSON.parse(sessionStorage.getItem("carrinho")) || [];
}

function Carrinho() {
    const [itens, setItens] = useState(carregarCarrinhoInicial);
    const navigate = useNavigate();

    function removerProduto(id) {
        const novoCarrinho = itens.filter((item) => item.id !== id);

        sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));

        setItens(novoCarrinho);
    }

    function alterarQuantidade(id, quantidade) {
        if (quantidade < 1) {
            return;
        }

        const novoCarrinho = itens.map((item) =>
            item.id === id
                ? {
                      ...item,
                      quantidade
                  }
                : item
        );

        sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));

        setItens(novoCarrinho);
    }

    const total = itens.reduce((soma, item) => soma + Number(item.preco) * item.quantidade, 0);

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
                    {itens.map((item) => (
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
                                        R${" "}
                                        {(Number(item.preco) * item.quantidade).toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2
                                        })}
                                    </strong>
                                </div>

                                <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 mt-3">
                                    <label className="form-label mb-0" htmlFor={`quantidade-${item.id}`}>
                                        Quantidade
                                    </label>

                                    <input
                                        id={`quantidade-${item.id}`}
                                        type="number"
                                        className="form-control"
                                        style={{ maxWidth: "100px" }}
                                        value={item.quantidade}
                                        min="1"
                                        onChange={(e) => alterarQuantidade(item.id, Number(e.target.value))}
                                    />

                                    <button className="btn btn-danger" onClick={() => removerProduto(item.id)}>
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

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

                    <button className="btn btn-success w-100" onClick={() => navigate("/checkout")}>
                        Finalizar Pedido
                    </button>
                </>
            )}
        </div>
    );
}

export default Carrinho;
