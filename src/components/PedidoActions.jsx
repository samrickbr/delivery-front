import { useState } from "react";
import CancelarItensModal from "./pedido/CancelarItensModal";
import ConfirmDialog from "./ConfirmDialog";
import InputDialog from "./InputDialog";
import {
    colocarPendenteItem,
    iniciarProducaoItem,
    finalizarItem
} from "../services/pedidoService";

function PedidoActions({ pedido, item, setor, onAtualizar, onDigitando }) {
    const [showDialog, setShowDialog] = useState(false);
    const [acaoSelecionada, setAcaoSelecionada] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [mostrarCancelamento, setMostrarCancelamento] = useState(false);
    const [processando, setProcessando] = useState(false);
    const [itemEmEspera, setItemEmEspera] = useState(null);

    function confirmar(acao) {
        setAcaoSelecionada(() => acao);
        setShowDialog(true);
        onDigitando?.(true);
    }

    function fecharConfirmacao() {
        setShowDialog(false);
        setAcaoSelecionada(null);
        onDigitando?.(false);
    }

    function abrirEspera(item) {
        setItemEmEspera(item);
        setShowInput(true);
        onDigitando?.(true);
    }

    function abrirCancelamento() {
        setMostrarCancelamento(true);
        onDigitando?.(true);
    }

    async function executar(acao) {
        if (processando) {
            return;
        }

        setProcessando(true);

        try {
            await acao();
            await onAtualizar();
        } catch (error) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Erro ao atualizar pedido."
            );
        } finally {
            setProcessando(false);
        }
    }

    async function executarConfirmacao() {
        if (!acaoSelecionada) {
            return;
        }

        await executar(acaoSelecionada);
        fecharConfirmacao();
    }

    if (item.statusOperacao === "CANCELADO" || item.statusOperacao === "FINALIZADO") {
        return null;
    }

    return (
        <div className="mt-3">
            {item.statusOperacao === "APROVADO" && (
                <div className="d-flex flex-nowrap gap-1 pedido-item-acoes">
                    <button
                        className="btn btn-primary btn-sm flex-fill text-nowrap"
                        disabled={processando}
                        onClick={() => confirmar(() => iniciarProducaoItem(pedido.id, item.id))}
                    >
                        Produzir
                    </button>

                    <button
                        className="btn btn-warning btn-sm flex-fill text-nowrap"
                        disabled={processando}
                        onClick={() => abrirEspera(item)}
                    >
                        Espera
                    </button>

                    <button
                        className="btn btn-danger btn-sm flex-fill text-nowrap"
                        disabled={processando}
                        onClick={abrirCancelamento}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            {item.statusOperacao === "EM_PRODUCAO" && (
                <div className="d-flex flex-nowrap gap-1 pedido-item-acoes">
                    <button
                        className="btn btn-success btn-sm flex-fill text-nowrap"
                        disabled={processando}
                        onClick={() => confirmar(() => finalizarItem(pedido.id, item.id))}
                    >
                        Finalizar
                    </button>

                    <button
                        className="btn btn-warning btn-sm flex-fill text-nowrap"
                        disabled={processando}
                        onClick={() => abrirEspera(item)}
                    >
                        Espera
                    </button>

                    <button
                        className="btn btn-danger btn-sm flex-fill text-nowrap"
                        disabled={processando}
                        onClick={abrirCancelamento}
                    >
                        Cancelar
                    </button>
                </div>
            )}

            <ConfirmDialog
                show={showDialog}
                titulo="Confirmar ação"
                mensagem="Deseja realmente executar esta ação?"
                onConfirm={executarConfirmacao}
                onCancel={fecharConfirmacao}
            />

            <InputDialog
                show={showInput}
                onDigitando={onDigitando}
                titulo="Colocar em espera"
                mensagem="Informe o motivo."
                placeholder="Ex.: Sem calabresa"
                onCancel={() => {
                    setShowInput(false);
                    setItemEmEspera(null);
                    onDigitando?.(false);
                }}
                onConfirm={async (motivo) => {
                    setShowInput(false);

                    if (itemEmEspera) {
                        await executar(() => colocarPendenteItem(pedido.id, itemEmEspera.id, motivo));
                    }

                    setItemEmEspera(null);
                    onDigitando?.(false);
                }}
            />

            <CancelarItensModal
                pedido={pedido}
                setor={setor}
                mostrar={mostrarCancelamento}
                onFechar={() => {
                    setMostrarCancelamento(false);
                    onDigitando?.(false);
                }}
                onAtualizar={onAtualizar}
                onDigitando={onDigitando}
            />
        </div>
    );
}

export default PedidoActions;
