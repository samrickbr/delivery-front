import { formatarValor } from "../checkoutUtils";

function PedidoItens({ carrinho }) {
    return (
        <div className="mb-4">
            <h5>Pedido</h5>

            {carrinho.length === 0 ? (
                <div className="alert alert-warning">Seu carrinho está vazio.</div>
            ) : (
                <ul className="list-group mb-3">
                    {carrinho.map((item) => {
                        const valorItem = Number(item.preco || 0) * Number(item.quantidade || 0);

                        return (
                            <li
                                key={item.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <span>
                                    {item.quantidade}x {item.nome}
                                </span>

                                <strong>{formatarValor(valorItem)}</strong>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default PedidoItens;
