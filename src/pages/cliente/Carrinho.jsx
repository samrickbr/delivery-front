import { useEffect, useState } from "react";

function Carrinho() {
    const [itens, setItens] = useState([]);

    function carregarCarrinho() {
        const carrinho = JSON.parse(sessionStorage.getItem("carrinho")) || [];

        setItens(carrinho);
    }

    useEffect(() => {
        carregarCarrinho();
    }, []);

    function removerProduto(id) {
        const novoCarrinho = itens.filter((item) => item.id !== id);

        sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));

        setItens(novoCarrinho);
    }

    function alterarQuantidade(id, quantidade) {
        if (quantidade < 1) return;

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

    const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

    return (
        <div className="container mt-4">
            <h1>Carrinho</h1>

            {itens.length === 0 && <p>Carrinho vazio.</p>}

            {itens.map((item) => (
                <div className="card mb-3" key={item.id}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">{item.nome}</h5>

                            <span>
                                Preço: R${" "}
                                {item.preco.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2
                                })}
                            </span>
                        </div>

                        <div className="d-flex justify-content-end align-items-center gap-3 mt-3">
                            <input
                                type="number"
                                className="form-control"
                                style={{ width: "80px" }}
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

            <h3>
                Total: R${" "}
                {total.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                })}
            </h3>

            <button className="btn btn-success w-100" disabled={itens.length === 0}>
                Finalizar Pedido
            </button>
        </div>
    );
}

export default Carrinho;
