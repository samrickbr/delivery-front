import CancelarItensModal from "./pedido/CancelarItensModal";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import InputDialog from "./InputDialog";
import {
    cancelarPedido,
    colocarPendente,
    iniciarProducao,
    finalizarPedido
} from "../services/pedidoService";

function PedidoActions({ pedido, setor, onAtualizar, onDigitando }) {
    const [showDialog, setShowDialog] = useState(false);
    const [acaoSelecionada, setAcaoSelecionada] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [showCancelamento, setShowCancelamento] = useState(false);
    const [processando, setProcessando] = useState(false);
    const itemSetor = pedido.itens.find((item) => item.setor === setor);
    const statusOperacao = itemSetor?.statusOperacao;
    const [mostrarCancelamento, setMostrarCancelamento] = useState(false);

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

                    <button className="btn btn-warning" disabled={processando} onClick={abrirEspera}>
                        Espera
                    </button>

                    <button className="btn btn-danger" onClick={() => setMostrarCancelamento(true)}>
                        ❌ Cancelar
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

                    <button className="btn btn-danger" disabled={processando} onClick={() => setShowCancelamento(true)}>
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
                onDigitando={onDigitando}
                titulo="Colocar em espera"
                mensagem="Informe o motivo."
                placeholder="Ex.: Sem calabresa"
                onCancel={() => setShowInput(false)}
                onConfirm={async (motivo) => {
                    setShowInput(false);
                    await executar(() => colocarPendente(pedido.id, setor, motivo));
                }}
            />
            <InputDialog
                show={showCancelamento}
                titulo="Cancelar item"
                mensagem="Informe o motivo do cancelamento."
                placeholder="Ex.: Sem ingrediente"
                onCancel={() => setShowCancelamento(false)}
                onConfirm={async (motivo) => {
                    setShowCancelamento(false);

                    await executar(async () => {
                        await cancelarPedido(pedido.id, setor, motivo);
                    });
                }}
            />
            <CancelarItensModal
                pedido={pedido}
                setor={setor}
                mostrar={mostrarCancelamento}
                onFechar={() => setMostrarCancelamento(false)}
                onAtualizar={onAtualizar}
            />
        </div>
    );
}

export default PedidoActions;
