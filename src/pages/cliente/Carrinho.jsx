import { useCarrinho } from "../../context/CarrinhoContext";

function Carrinho() {
    const { itens, removerProduto, total } = useCarrinho();

    return (
        <div className="container mt-4">
            <h1>Carrinho</h1>

            {itens.length === 0 && <p>Nenhum produto adicionado.</p>}

            {itens.map((item) => (
                <div className="card mb-3" key={item.id}>
                    <div className="card-body">
                        <h5>{item.nome}</h5>

                        <p>Quantidade: {item.quantidade}</p>

                        <p>
                            R${" "}
                            {(item.preco * item.quantidade).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2
                            })}
                        </p>

                        <button className="btn btn-danger" onClick={() => removerProduto(item.id)}>
                            Remover
                        </button>
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
