function MiniPdvAcoes({
    podeFinalizar = false,
    carregando = false,
    onFinalizar,
    onEnviarBalcao,
    onLimpar
}) {
    return (
        <div className="d-flex flex-column gap-2">
            <button
                type="button"
                className="btn btn-primary btn-lg w-100"
                onClick={onFinalizar}
                disabled={
                    carregando ||
                    !podeFinalizar
                }
            >
                {carregando
                    ? "Processando..."
                    : "Finalizar venda"}
            </button>

            <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={onEnviarBalcao}
                disabled={
                    carregando ||
                    !podeFinalizar
                }
            >
                Enviar para balcão
            </button>

            <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={onLimpar}
                disabled={carregando}
            >
                Nova venda
            </button>
        </div>
    );
}

export default MiniPdvAcoes;
