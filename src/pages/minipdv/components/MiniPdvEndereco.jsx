import { useEffect, useRef, useState } from "react";

function MiniPdvEndereco({
    cliente,
    enderecos = [],
    endereco,
    carregando = false,
    erro = "",
    onEnderecoSelecionado,
    onCadastrarEndereco
}) {
    const [indiceSelecionado, setIndiceSelecionado] =
        useState(0);

    const listaRef = useRef(null);

    useEffect(() => {
    }, [enderecos]);

    useEffect(() => {
        const itemSelecionado =
            listaRef.current?.querySelector(
                `[data-indice="${indiceSelecionado}"]`
            );

        itemSelecionado?.scrollIntoView({
            block: "nearest"
        });
    }, [indiceSelecionado]);

    function selecionarEndereco(item) {
        onEnderecoSelecionado(item);
    }

    function handleKeyDown(event) {
        if (!enderecos.length) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            setIndiceSelecionado(
                (atual) =>
                    (atual + 1) % enderecos.length
            );

            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            setIndiceSelecionado(
                (atual) =>
                    (atual -
                        1 +
                        enderecos.length) %
                    enderecos.length
            );

            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();

            const selecionado =
                enderecos[indiceSelecionado];

            if (selecionado) {
                selecionarEndereco(selecionado);
            }
        }
    }

    function formatarEndereco(item) {
        const linhaPrincipal = [
            item.logradouro || item.rua,
            item.numero
        ]
            .filter(Boolean)
            .join(", ");

        const linhaSecundaria = [
            item.bairro,
            item.cidade,
            item.uf
        ]
            .filter(Boolean)
            .join(" — ");

        return {
            linhaPrincipal:
                linhaPrincipal || "Endereço",
            linhaSecundaria
        };
    }

    if (!cliente) {
        return null;
    }

    if (endereco) {
        const enderecoFormatado =
            formatarEndereco(endereco);

        return (
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h2 className="h5 mb-0">
                            Endereço de entrega
                        </h2>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                                onEnderecoSelecionado(
                                    null
                                )
                            }
                        >
                            Alterar
                        </button>
                    </div>

                    <div className="border rounded p-3">
                        <div className="fw-semibold">
                            {
                                enderecoFormatado.linhaPrincipal
                            }
                        </div>

                        {enderecoFormatado.linhaSecundaria && (
                            <small className="text-muted">
                                {
                                    enderecoFormatado.linhaSecundaria
                                }
                            </small>
                        )}

                        {endereco.complemento && (
                            <small className="d-block text-muted">
                                {
                                    endereco.complemento
                                }
                            </small>
                        )}

                        {endereco.cep && (
                            <small className="d-block text-muted">
                                CEP: {endereco.cep}
                            </small>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h2 className="h5 mb-0">
                        Endereço de entrega
                    </h2>

                    <span className="badge text-bg-warning">
                        Selecionar endereço
                    </span>
                </div>

                {carregando && (
                    <div className="text-muted">
                        Carregando endereços...
                    </div>
                )}

                {erro && (
                    <div className="alert alert-danger">
                        {erro}
                    </div>
                )}

                {!carregando &&
                    !erro &&
                    enderecos.length ===
                        0 && (
                        <div>
                            <div className="text-muted mb-3">
                                Este cliente não possui
                                endereço cadastrado.
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={
                                    onCadastrarEndereco
                                }
                            >
                                Cadastrar endereço
                            </button>
                        </div>
                    )}

                {!carregando &&
                    !erro &&
                    enderecos.length > 0 && (
                        <>
                            <div className="small text-muted mb-2">
                                ↑ ↓ navegar · ENTER
                                selecionar
                            </div>

                            <div
                                ref={listaRef}
                                tabIndex={0}
                                onKeyDown={
                                    handleKeyDown
                                }
                                className="list-group"
                                style={{
                                    maxHeight:
                                        "280px",
                                    overflowY:
                                        "auto",
                                    outline: "none"
                                }}
                            >
                                {enderecos.map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const selecionado =
                                            index ===
                                            indiceSelecionado;

                                        const enderecoFormatado =
                                            formatarEndereco(
                                                item
                                            );

                                        return (
                                            <button
                                                key={
                                                    item.id
                                                }
                                                type="button"
                                                data-indice={
                                                    index
                                                }
                                                className={`list-group-item list-group-item-action ${
                                                    selecionado
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onMouseEnter={() =>
                                                    setIndiceSelecionado(
                                                        index
                                                    )
                                                }
                                                onClick={() =>
                                                    selecionarEndereco(
                                                        item
                                                    )
                                                }
                                            >
                                                <div className="fw-semibold">
                                                    {
                                                        enderecoFormatado.linhaPrincipal
                                                    }
                                                </div>

                                                {enderecoFormatado.linhaSecundaria && (
                                                    <small
                                                        className={
                                                            selecionado
                                                                ? "text-white-50"
                                                                : "text-muted"
                                                        }
                                                    >
                                                        {
                                                            enderecoFormatado.linhaSecundaria
                                                        }
                                                    </small>
                                                )}

                                                {item.cep && (
                                                    <small
                                                        className={
                                                            selecionado
                                                                ? "d-block text-white-50"
                                                                : "d-block text-muted"
                                                        }
                                                    >
                                                        CEP:{" "}
                                                        {
                                                            item.cep
                                                        }
                                                    </small>
                                                )}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </>
                    )}
            </div>
        </div>
    );
}

export default MiniPdvEndereco;
