import OperacaoPedidos from "../../components/pedido/OperacaoPedidos";

function Lanchonete() {
    return (
        <OperacaoPedidos
            setor="COZINHA"
            titulo="Lanchonete"
            mostrarValor={false}
        />
    );
}

export default Lanchonete;