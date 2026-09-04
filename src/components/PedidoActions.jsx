import { useState } from "react";
import CancelarItensModal from "./pedido/CancelarItensModal";
import ConfirmDialog from "./ConfirmDialog";
import InputDialog from "./InputDialog";
import {
    colocarPendente,
    iniciarProducao,
    finalizarPedido
} from "../services/pedidoService";

function PedidoActions({ pedido, setor, onAtualizar, onDigitando }) {
    const [showDialog, setShowDialog] = useState(false);
    const [acaoSelecionada, setAcaoSelecionada] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [mostrarCancelamento, setMostrarCancelamento] = useState(false);
    const [processando, setProcessando] = useState(false);

    const itensDoSetor =
        pedido.itens?.filter(
            (item) =>
                item.setor === setor &&
                item.statusOperacao !== "CANCELADO"
        ) || [];

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

    function abrirEspera() {
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

    if (itensDoSetor.length === 0) {
        return null;
    }

    return (
        <div className="mt-3">

            {itensDoSetor.map((item) => (
                <div
                    key={item.id}
                    className="border rounded p-3 mb-3"
                >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <div className="fw-bold">
                                {item.quantidade}x {item.produto}
                            </div>

                            {item.categoria && (
                                <small className="text-muted">
                                    {item.categoria}
                                </small>
                            )}
                        </div>

                        <span className="badge bg-secondary">
                            {item.statusOperacao?.replaceAll("_", " ")}
                        </span>
                    </div>

                    {item.statusOperacao === "APROVADO" && (
                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-primary"
                                disabled={processando}
                                onClick={() =>
                                    confirmar(() =>
                                        iniciarProducao(
                                            pedido.id,
                                            setor
                                        )
                                    )
                                }
                            >
                                Produzir
                            </button>

                            <button
                                className="btn btn-warning"
                                disabled={processando}
                                onClick={abrirEspera}
                            >
                                Espera
                            </button>

                            <button
                                className="btn btn-danger"
                                disabled={processando}
                                onClick={abrirCancelamento}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}

                    {item.statusOperacao === "PENDENTE" && (
                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-primary"
                                disabled={processando}
                                onClick={() =>
                                    confirmar(() =>
                                        iniciarProducao(
                                            pedido.id,
                                            setor
                                        )
                                    )
                                }
                            >
                                Retomar
                            </button>

                            <button
                                className="btn btn-danger"
                                disabled={processando}
                                onClick={abrirCancelamento}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}

                    {item.statusOperacao === "EM_PRODUCAO" && (
                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-success"
                                disabled={processando}
                                onClick={() =>
                                    confirmar(() =>
                                        finalizarPedido(
                                            pedido.id,
                                            setor
                                        )
                                    )
                                }
                            >
                                Finalizar
                            </button>

                            <button
                                className="btn btn-warning"
                                disabled={processando}
                                onClick={abrirEspera}
                            >
                                Espera
                            </button>

                            <button
                                className="btn btn-danger"
                                disabled={processando}
                                onClick={abrirCancelamento}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            ))}

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
                    onDigitando?.(false);
                }}
                onConfirm={async (motivo) => {
                    setShowInput(false);

                    await executar(() =>
                        colocarPendente(
                            pedido.id,
                            setor,
                            motivo
                        )
                    );

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
