import BalcaoPainel from "../../components/pedido/BalcaoPainel";
import { useLocation } from "react-router-dom";
import useNotificacoesOperacionais from "../../hooks/useNotificacoesOperacionais";

function Balcao() {
    const { state } = useLocation();
    const { pedidosProntosIds } = useNotificacoesOperacionais();

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Balcão</h1>

            <BalcaoPainel
                pedidoDirecionadoId={state?.pedidoId}
                pedidoItemDirecionadoId={state?.pedidoItemId}
                pedidosProntosIds={pedidosProntosIds}
            />
        </div>
    );
}

export default Balcao;
