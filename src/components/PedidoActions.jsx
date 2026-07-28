import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import InputDialog from "./InputDialog";
import {
    cancelarPedido,
    colocarPendente,
    enviarCozinha,
    iniciarProducao,
    finalizarPedido
} from "../services/pedidoService";

function PedidoActions({ pedido, setor, onAtualizar }) {
    const [showDialog, setShowDialog] = useState(false);
    const [acaoSelecionada, setAcaoSelecionada] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [motivoCancelamento, setMotivoCancelamento] = useState("");
    const [mostrarCancelamento, setMostrarCancelamento] = useState(false);
    const [processando, setProcessando] = useState(false);
    const statusOperacao = pedido.itens[0]?.statusOperacao;

    async function cancelarPedido() {
        await cancelarPedido(pedido.id, motivoCancelamento);

        setMostrarCancelamento(false);
        setMotivoCancelamento("");
        onAtualizar();
    }

    function confirmar(acao) {
        setAcaoSelecionada(() => acao);
        setShowDialog(true);
    }
    function abrirEspera() {
        setShowInput(true);
    }

    async function executar(acao) {
        if (processando) return;
        setProcessando(true);

        try {
            await acao();
            onAtualizar();
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar pedido.");
        } finally {
            setProcessando(false);
        }
    }

    async function executarConfirmacao() {
        await executar(acaoSelecionada);
        setShowDialog(false);
        setAcaoSelecionada(null);
    }

    return (
        <div className="d-grid gap-2 mt-3">
            {statusOperacao === "APROVADO" && (
                <>
                    <button
                        className="btn btn-primary btn-lg"
                        disabled={processando}
                        onClick={() => confirmar(() => iniciarProducao(pedido.id, setor))}
                    >
                        Produzir
                    </button>

                    <button
                        className="btn btn-warning"
                        disabled={processando}
                        onClick={() => confirmar(() => iniciarProducao(pedido.id, setor))}
                    >
                        Espera
                    </button>

                    <button
                        className="btn btn-danger"
                        disabled={processando}
                        onClick={() => setMostrarCancelamento(true)}
                    >
                        Cancelar
                    </button>
                </>
            )}

            {statusOperacao === "PENDENTE" && (
                <>
                    <button
                        className="btn btn-primary btn-lg"
                        disabled={processando}
                        onClick={() => confirmar(() => iniciarProducao(pedido.id, setor))}
                    >
                        Retomar
                    </button>

                    <button
                        className="btn btn-danger"
                        disabled={processando}
                        onClick={() => setMostrarCancelamento(true)}
                    >
                        Cancelar
                    </button>
                </>
            )}

            {statusOperacao === "EM_PRODUCAO" && (
                <>
                    <button
                        className="btn btn-success"
                        disabled={processando}
                        onClick={() => confirmar(() => finalizarPedido(pedido.id, setor))}
                    >
                        Finalizar
                    </button>

                    <button className="btn btn-warning" disabled={processando} onClick={abrirEspera}>
                        Espera
                    </button>
                </>
            )}
            <ConfirmDialog
                show={showDialog}
                titulo="Confirmar ação"
                mensagem="Deseja realmente executar esta ação?"
                onConfirm={executarConfirmacao}
                onCancel={() => setShowDialog(false)}
            />
            <InputDialog
                show={showInput}
                titulo="Colocar em espera"
                mensagem="Informe o motivo."
                placeholder="Ex.: Sem calabresa"
                onCancel={() => setShowInput(false)}
                onConfirm={async (motivo) => {
                    setShowInput(false);
                    await executar(() => colocarPendente(pedido.id, motivo));
                }}
            />
            {mostrarCancelamento && (
                <div className="mt-2">
                    <textarea
                        className="form-control mb-2"
                        placeholder="Motivo do cancelamento"
                        value={motivoCancelamento}
                        onChange={(e) => setMotivoCancelamento(e.target.value)}
                    />

                    <button className="btn btn-danger" onClick={cancelarPedido} disabled={!motivoCancelamento}>
                        Confirmar Cancelamento
                    </button>
                </div>
            )}
        </div>
    );
}

export default PedidoActions;
