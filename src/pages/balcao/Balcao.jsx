import { useEffect, useState } from "react";
import PedidoCard from "../../components/pedido/PedidoCard";
import { listarPorStatus, aprovarPedido, enviarCozinha, cancelarPedido } from "../../services/pedidoService";
import ChecklistSeparacao from "../../components/pedido/ChecklistSeparacao";
import { liberarEntrega } from "../../services/pedidoService";

// =====================================
// ABAS DO BALCÃO
// =====================================

const ABAS = {
    PEDIDOS: "pedidos",
    PRODUCAO: "producao",
    SEPARACAO: "separacao"
};

function Balcao() {
    const [pedidos, setPedidos] = useState([]);
    const [aba, setAba] = useState(ABAS.PEDIDOS);
    const [checklist, setChecklist] = useState({});

    // =====================================
    // CARREGAMENTO DOS PEDIDOS
    //
    // PEDIDOS    -> RECEBIDO
    // PRODUÇÃO   -> APROVADO
    // SEPARAÇÃO  -> FINALIZADO
    // =====================================

    async function carregarPedidos() {
        let response;

        switch (aba) {
            case ABAS.PEDIDOS:
                response = await listarPorStatus("RECEBIDO");
                break;

            case ABAS.PRODUCAO:
                response = await listarPorStatus("APROVADO");
                break;

            case ABAS.SEPARACAO:
                response = await listarPorStatus("FINALIZADO");
                break;

            default:
                response = { data: [] };
        }

        setPedidos(response.data);
    }

    // =====================================
    // RECEBIDO -> APROVADO
    // =====================================

    async function aceitarPedido(id) {
        await aprovarPedido(id);
        carregarPedidos();
    }

    // =====================================
    // APROVADO -> EM_PRODUCAO
    // =====================================

    async function enviarParaCozinha(id) {
        await enviarCozinha(id);
        carregarPedidos();
    }

    // =====================================
    // SEPARAÇÃO DE ITENS
    // =====================================

    function marcarItem(itemId, marcado) {
        setChecklist((old) => ({
            ...old,
            [itemId]: marcado
        }));
    }

    async function enviarEntrega(pedido) {
        const itens = pedido.itens.map((item) => ({
            itemId: item.id,
            separado: checklist[item.id] || false
        }));

        await liberarEntrega(pedido.id, itens);

        carregarPedidos();
    }

    // =====================================
    // CANCELAR PEDIDO
    // =====================================

    async function cancelar(id) {
        await cancelarPedido(id, "");
        carregarPedidos();
    }

    // =====================================
    // ATUALIZAÇÃO AUTOMÁTICA
    // =====================================

    useEffect(() => {
        carregarPedidos();

        const intervalo = setInterval(() => {
            if (!document.hidden) {
                carregarPedidos();
            }
        }, 10000);

        return () => clearInterval(intervalo);
    }, [aba]);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Balcão</h1>

            {/* ===========================
                ABAS
            ============================ */}

            <div className="mb-4">
                <button
                    className={`btn me-2 ${aba === ABAS.PEDIDOS ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setAba(ABAS.PEDIDOS)}
                >
                    📥 Pedidos
                </button>

                <button
                    className={`btn me-2 ${aba === ABAS.PRODUCAO ? "btn-warning" : "btn-outline-warning"}`}
                    onClick={() => setAba(ABAS.PRODUCAO)}
                >
                    ⏳ Produção
                </button>
                <button
                    className={`btn ${aba === ABAS.SEPARACAO ? "btn-success" : "btn-outline-success"}`}
                    onClick={() => setAba(ABAS.SEPARACAO)}
                >
                    📦 Separação
                </button>
            </div>

            <div className="row">
                {pedidos.map((pedido) => (
                    <div className="col-md-6" key={pedido.id}>
                        <PedidoCard pedido={pedido}>
                            {/* RECEBIDO */}

                            {pedido.status === "RECEBIDO" && (
                                <>
                                    <button
                                        className="btn btn-success w-100 mb-2"
                                        onClick={() => aceitarPedido(pedido.id)}
                                    >
                                        ✅ Aceitar Pedido
                                    </button>

                                    <button className="btn btn-danger w-100" onClick={() => cancelar(pedido.id)}>
                                        ❌ Cancelar
                                    </button>
                                </>
                            )}

                            {/* APROVADO */}

                            {pedido.status === "APROVADO" && (
                                <button className="btn btn-primary w-100" onClick={() => enviarParaCozinha(pedido.id)}>
                                    🍳 Enviar para Cozinha
                                </button>
                            )}

                            {/* FINALIZADO */}

                            {pedido.status === "FINALIZADO" && (
                                <ChecklistSeparacao pedido={pedido} onAtualizar={carregarPedidos} />
                            )}
                        </PedidoCard>
                    </div>
                ))}
            </div>

            {pedidos.length === 0 && (
                <div className="text-center mt-5">
                    <h4>Nenhum pedido nesta etapa.</h4>
                </div>
            )}
        </div>
    );
}

export default Balcao;
