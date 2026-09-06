function HistoricoPedido({ historico = [] }) {
    if (!historico.length) {
        return null;
    }

    return (
        <details className="mt-3">
            <summary className="fw-bold" style={{ cursor: "pointer" }}>
                Histórico ({historico.length})
            </summary>

            <div className="list-group mt-2">
                {historico.map((evento, index) => (
                    <div key={index} className="list-group-item">
                        <div className="d-flex justify-content-between">
                            <strong>{evento.acao.replaceAll("_", " ")}</strong>

                            <small className="text-muted">{new Date(evento.dataHora).toLocaleString("pt-BR")}</small>
                        </div>

                        <small className="text-primary">{evento.setor}</small>

                        <div>{evento.descricao}</div>

                        <small className="text-muted">{evento.usuario}</small>
                    </div>
                ))}
            </div>
        </details>
    );
}

export default HistoricoPedido;
