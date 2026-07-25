import OperacaoPedidos from "../../components/pedido/OperacaoPedidos";

function Cozinha() {
    
    return (
        <OperacaoPedidos
            setor="PIZZARIA"
            titulo="Pizzaria"
            mostrarValor={false}
        />
    );
}

export default Cozinha;