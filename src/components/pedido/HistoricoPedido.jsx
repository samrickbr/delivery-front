function HistoricoPedido({ historico = [] }) {
    if (!historico.length) {
        return null;
    }

    return (
        <div className="mt-3">
            <h6 className="fw-bold">Histórico</h6>

            <div className="list-group">
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
        </div>
    );
}

export default HistoricoPedido;
