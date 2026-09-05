import { useEffect, useRef, useState } from "react";
import { buscarClientesOperacional } from "../../../services/clienteService";

function MiniPdvCliente({
    cliente = null,
    onClienteSelecionado,
    onClienteLimpo,
    onDefinirEntrega,
    onDefinirRetirada,
    onCadastrarCliente
}) {
    const [clienteSelecionado, setClienteSelecionado] = useState(cliente);
    const [busca, setBusca] = useState("");
    const [clientes, setClientes] = useState([]);
    const [indiceSelecionado, setIndiceSelecionado] = useState(0);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const resultadosRef = useRef(null);

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
                setIndiceSelecionado(0);
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

    useEffect(() => {
        const resultadoSelecionado = resultadosRef.current?.querySelector(`[data-indice="${indiceSelecionado}"]`);

        resultadoSelecionado?.scrollIntoView({ block: "nearest" });
    }, [indiceSelecionado]);

    function selecionarCliente(clienteEscolhido) {
        setClienteSelecionado(clienteEscolhido);
        onClienteSelecionado?.(clienteEscolhido);
        setBusca("");
        setClientes([]);
    }

    function limparCliente() {
        setClienteSelecionado(null);
        onClienteLimpo?.();
        setBusca("");
        setClientes([]);
    }

    function confirmarAlteracaoCliente() {
        if (window.confirm("Tem certeza que deseja alterar o cliente?")) {
            limparCliente();
        }
    }

    function selecionarClienteSelecionado() {
        const clienteEscolhido = clientes[indiceSelecionado];

        if (clienteEscolhido) {
            selecionarCliente(clienteEscolhido);
        }
    }

    function handleBuscaKeyDown(event) {
        if (event.key === "ArrowDown") {
            event.preventDefault();

            if (clientes.length) {
                setIndiceSelecionado((atual) => (atual + 1) % clientes.length);
            }

            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            if (clientes.length) {
                setIndiceSelecionado((atual) => (atual - 1 + clientes.length) % clientes.length);
            }

            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            selecionarClienteSelecionado();
        }
    }

    return (
        <div className="border rounded bg-body">
            <div className="p-3">
                {!clienteAtivo ? (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label small fw-semibold mb-0">Buscar cliente</label>

                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={onCadastrarCliente}>
                                Novo cliente
                            </button>
                        </div>

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
                            onKeyDown={handleBuscaKeyDown}
                        />

                        {carregando && <div className="text-muted small mt-2">Buscando clientes...</div>}

                        {erro && <div className="alert alert-danger py-2 mt-2 mb-0">{erro}</div>}

                        {!carregando && !erro && clientes.length > 0 && (
                            <div
                                ref={resultadosRef}
                                className="list-group mt-2"
                                style={{ maxHeight: "160px", overflowY: "auto" }}
                            >
                                {clientes.map((item, indice) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        data-indice={indice}
                                        className={`list-group-item list-group-item-action text-start ${
                                            indice === indiceSelecionado ? "active" : ""
                                        }`}
                                        onMouseEnter={() => setIndiceSelecionado(indice)}
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
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <div className="min-w-0">
                                <div className="fw-semibold text-truncate">
                                    {clienteAtivo.nome || clienteAtivo.nomeCompleto || "Cliente"}
                                </div>

                                {clienteAtivo.documento && (
                                    <div className="text-muted small text-truncate">
                                        Documento: {clienteAtivo.documento}
                                    </div>
                                )}
                            </div>

                            <div className="d-flex gap-2 flex-shrink-0">
                                <button type="button" className="btn btn-primary" onClick={onDefinirRetirada}>
                                    Retirada
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={onDefinirEntrega}
                                >
                                    Entrega
                                </button>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-2">
                            <button
                                type="button"
                                className="btn btn-link btn-sm px-0 text-decoration-none"
                                onClick={confirmarAlteracaoCliente}
                            >
                                Trocar cliente
                            </button>

                            <button
                                type="button"
                                className="btn btn-link btn-sm px-0 text-decoration-none"
                                onClick={confirmarAlteracaoCliente}
                            >
                                Sem cliente
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MiniPdvCliente;
