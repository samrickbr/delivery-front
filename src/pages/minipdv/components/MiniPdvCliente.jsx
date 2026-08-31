import { useEffect, useState } from "react";
import { buscarClientesOperacional } from "../../../services/clienteService";

function MiniPdvCliente({ cliente = null, onClienteSelecionado, onDefinirEntrega, onDefinirRetirada }) {
    const [clienteSelecionado, setClienteSelecionado] = useState(cliente);
    const [busca, setBusca] = useState("");
    const [clientes, setClientes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const clienteAtivo = cliente ?? clienteSelecionado;

    useEffect(() => {
        const termo = busca.trim();

        if (!termo) {
            return undefined;
        }

        let ativo = true;
        const timeoutId = setTimeout(async () => {
            try {
                setCarregando(true);
                setErro("");

                const resultado = await buscarClientesOperacional(termo);

                if (!ativo) {
                    return;
                }

                const lista = Array.isArray(resultado) ? resultado : resultado?.content || [];
                setClientes(lista);
            } catch (error) {
                if (!ativo) {
                    return;
                }

                console.error("Erro ao buscar clientes operacionais.", error);
                setClientes([]);
                setErro("Não foi possível buscar clientes.");
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }, 300);

        return () => {
            ativo = false;
            clearTimeout(timeoutId);
        };
    }, [busca]);

    function selecionarCliente(clienteEscolhido) {
        setClienteSelecionado(clienteEscolhido);
        onClienteSelecionado?.(clienteEscolhido);
        setBusca("");
        setClientes([]);
    }

    return (
        <div className="border rounded bg-body">
            <div className="p-3 border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                    <strong>Cliente</strong>

                    {clienteAtivo && <span className="badge text-bg-success">Identificado</span>}
                </div>
            </div>

            <div className="p-3">
                {!clienteAtivo ? (
                    <div>
                        <label className="form-label small fw-semibold">Buscar cliente</label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nome, CPF ou telefone"
                            value={busca}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setBusca(valor);

                                if (!valor.trim()) {
                                    setClientes([]);
                                    setErro("");
                                }
                            }}
                        />

                        {carregando && <div className="text-muted small mt-2">Buscando clientes...</div>}

                        {erro && <div className="alert alert-danger py-2 mt-2 mb-0">{erro}</div>}

                        {!carregando && !erro && clientes.length > 0 && (
                            <div className="list-group mt-2">
                                {clientes.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="list-group-item list-group-item-action text-start"
                                        onClick={() => selecionarCliente(item)}
                                    >
                                        <div className="fw-semibold">{item.nome || item.nomeCompleto || "Cliente"}</div>

                                        {item.documento && (
                                            <small className="text-muted">Documento: {item.documento}</small>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {!carregando && !erro && !busca.trim() && (
                            <div className="text-muted small mt-2">Digite para localizar um cliente operacional.</div>
                        )}

                        {!carregando && !erro && busca.trim() && clientes.length === 0 && (
                            <div className="text-muted small mt-2">Nenhum cliente encontrado.</div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="fw-semibold">{clienteAtivo.nome || clienteAtivo.nomeCompleto || "Cliente"}</div>

                        {clienteAtivo.documento && (
                            <div className="text-muted small">Documento: {clienteAtivo.documento}</div>
                        )}

                        <div className="mt-3">
                            <div className="small fw-semibold mb-2">Tipo de atendimento</div>

                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-primary flex-fill" onClick={onDefinirRetirada}>
                                    Retirada
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary flex-fill"
                                    onClick={onDefinirEntrega}
                                >
                                    Entrega
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MiniPdvCliente;
