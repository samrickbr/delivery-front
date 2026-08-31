import PedidoCard from "./PedidoCard";
import ChecklistSeparacao from "./ChecklistSeparacao";
import MiniPdvProdutos from "../../pages/minipdv/components/MiniPdvProdutos";
import CancelarItensModal from "./CancelarItensModal";
import BalcaoTabs from "./BalcaoTabs";
import useBalcaoPainel from "./useBalcaoPainel";

import { ABAS } from "./balcaoAbas";

// ============================================================
// Refatoração do painel de balcão.
//
// O componente agora se concentra apenas na renderização e na
// composição visual. A regra de negócio foi isolada em um hook
// próprio para evitar que o JSX fique carregado de estado,
// filtros e ações assíncronas.
// ============================================================
function BalcaoPainel({ aba: abaControlada, onAbaChange, exibirAbas = true }) {
    // =====================================
    // 1) Estado e ações centralizadas em hook
    // =====================================
    const {
        aba,
        pedidosFiltrados,
        retiradasFiltradas,
        pedidoSelecionado,
        mostrarModalEdicao,
        mostrarModalCancelamento,
        erroEdicao,
        setAba,
        pedidoPodeSerEditado,
        abrirEdicao,
        fecharEdicao,
        adicionarItem,
        alterarQuantidade,
        removerItem,
        abrirCancelamento,
        fecharCancelamento,
        aceitarPedido,
        conferir,
        concluirRetirada,
        carregarDados
    } = useBalcaoPainel({ aba: abaControlada, onAbaChange });

    // =====================================
    // 2) Renderização dos blocos do painel
    // =====================================
    return (
        <>
            <BalcaoTabs
                aba={aba}
                exibirAbas={exibirAbas}
                onChange={setAba}
                totalRetiradas={retiradasFiltradas.length}
            />

            {aba !== ABAS.RETIRADA && (
                <div className="row">
                    {pedidosFiltrados.map((pedido) => (
                        <div className="col-md-6" key={pedido.id}>
                            <PedidoCard pedido={pedido}>
                                {pedidoPodeSerEditado(pedido) && (
                                    <button className="btn btn-primary w-100 mb-2" onClick={() => abrirEdicao(pedido)}>
                                        ✏️ Editar Pedido
                                    </button>
                                )}

                                {pedido.status === "RECEBIDO" && (
                                    <>
                                        <button
                                            className="btn btn-success w-100 mb-2"
                                            onClick={() => aceitarPedido(pedido.id)}
                                        >
                                            ✅ Aceitar Pedido
                                        </button>

                                        <button
                                            className="btn btn-danger w-100"
                                            onClick={() => abrirCancelamento(pedido)}
                                        >
                                            ❌ Cancelar
                                        </button>
                                    </>
                                )}

                                {aba === ABAS.CONFERENCIA && (
                                    <button className="btn btn-success w-100" onClick={() => conferir(pedido.id)}>
                                        ✔ Confirmar Conferência
                                    </button>
                                )}

                                {aba === ABAS.SEPARACAO && (
                                    <ChecklistSeparacao pedido={pedido} onAtualizar={carregarDados} />
                                )}
                            </PedidoCard>
                        </div>
                    ))}
                </div>
            )}

            {aba === ABAS.RETIRADA && (
                <div className="row">
                    {retiradasFiltradas.map((pedido) => (
                        <div className="col-md-6" key={pedido.id}>
                            <PedidoCard pedido={pedido} mostrarValor={true}>
                                <button className="btn btn-warning w-100" onClick={() => concluirRetirada(pedido.id)}>
                                    🛍️ Concluir retirada
                                </button>
                            </PedidoCard>
                        </div>
                    ))}
                </div>
            )}

            {(aba === ABAS.RETIRADA ? retiradasFiltradas.length === 0 : pedidosFiltrados.length === 0) && (
                <div className="text-center mt-5">
                    <h4>Nenhum pedido nesta etapa.</h4>
                </div>
            )}

            {/* =====================================
                3) Modal de edição comercial

                Esse bloco permanece no componente porque ele é
                estritamente visual e depende do pedido selecionado
                para renderizar a lista de itens e o formulário de
                adição/alteração.
            ===================================== */}
            {mostrarModalEdicao && pedidoSelecionado && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <div className="modal-dialog modal-xl modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div>
                                    <h5 className="modal-title">
                                        Editar Pedido #{String(pedidoSelecionado.id).padStart(4, "0")}
                                    </h5>

                                    <small className="text-muted">Adicione, altere ou remova itens.</small>
                                </div>

                                <button type="button" className="btn-close" onClick={fecharEdicao} />
                            </div>

                            <div className="modal-body">
                                {erroEdicao && <div className="alert alert-danger">{erroEdicao}</div>}

                                <div className="row g-4">
                                    <div className="col-12 col-lg-6">
                                        <MiniPdvProdutos
                                            carrinho={[]}
                                            onAdicionarProduto={(produto) =>
                                                adicionarItem(pedidoSelecionado.id, produto.id, 1)
                                            }
                                        />
                                    </div>

                                    <div className="col-12 col-lg-6">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-0">Itens do pedido</h6>

                                                        <small className="text-muted">
                                                            Atualizados após cada operação
                                                        </small>
                                                    </div>

                                                    <strong>
                                                        R${" "}
                                                        {Number(pedidoSelecionado.valorTotal || 0).toLocaleString(
                                                            "pt-BR",
                                                            {
                                                                minimumFractionDigits: 2
                                                            }
                                                        )}
                                                    </strong>
                                                </div>

                                                {pedidoSelecionado.itens?.length === 0 ? (
                                                    <div className="alert alert-warning mb-0">
                                                        O pedido não possui itens.
                                                    </div>
                                                ) : (
                                                    <div className="list-group">
                                                        {pedidoSelecionado.itens.map((item) => (
                                                            <div key={item.id} className="list-group-item">
                                                                <div className="d-flex justify-content-between align-items-center gap-3">
                                                                    <div>
                                                                        <div className="fw-semibold">
                                                                            {item.produto}
                                                                        </div>

                                                                        <div className="small text-muted">
                                                                            {item.setor || "-"} · Item #{item.id}
                                                                        </div>
                                                                    </div>

                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-secondary"
                                                                            onClick={() =>
                                                                                alterarQuantidade(
                                                                                    pedidoSelecionado.id,
                                                                                    item.id,
                                                                                    Number(item.quantidade) - 1
                                                                                )
                                                                            }
                                                                        >
                                                                            −
                                                                        </button>

                                                                        <span
                                                                            className="fw-bold"
                                                                            style={{
                                                                                minWidth: "32px",
                                                                                textAlign: "center"
                                                                            }}
                                                                        >
                                                                            {item.quantidade}
                                                                        </span>

                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-secondary"
                                                                            onClick={() =>
                                                                                alterarQuantidade(
                                                                                    pedidoSelecionado.id,
                                                                                    item.id,
                                                                                    Number(item.quantidade) + 1
                                                                                )
                                                                            }
                                                                        >
                                                                            +
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-outline-danger"
                                                                            onClick={() =>
                                                                                removerItem(
                                                                                    pedidoSelecionado.id,
                                                                                    item.id
                                                                                )
                                                                            }
                                                                        >
                                                                            🗑️
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={fecharEdicao}>
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================
                4) Modal de cancelamento reutilizado

                Importamos o componente genérico já existente no
                projeto para evitar duplicação do mesmo fluxo de
                cancelamento em vários lugares.
            ===================================== */}
            {mostrarModalCancelamento && pedidoSelecionado && (
                <CancelarItensModal
                    pedido={pedidoSelecionado}
                    setor="BALCAO"
                    mostrar={mostrarModalCancelamento}
                    onFechar={fecharCancelamento}
                    onAtualizar={carregarDados}
                    permitirCompleto={true}
                />
            )}
        </>
    );
}

export default BalcaoPainel;
