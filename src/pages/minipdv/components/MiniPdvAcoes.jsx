function MiniPdvAcoes({
    podeFinalizar = false,
    carregando = false,
    onFinalizar,
    onEnviarBalcao,
    onRecuperar,
    onLimpar
}) {
    const atalhos = {
        finalizar: "F2",
        recuperar: "F3",
        limpar: "F4",
        enviar: "F5"
    };

    return (
        <div className="row g-2">
            <button
                type="button"
                className="btn btn-primary btn-lg col-6"
                onClick={onFinalizar}
                disabled={carregando || !podeFinalizar}
            >
                {carregando ? "Processando..." : "Finalizar venda"} <kbd>{atalhos.finalizar}</kbd>
            </button>

            <button
                type="button"
                className="btn btn-outline-primary col-6"
                onClick={onEnviarBalcao}
                disabled={carregando || !podeFinalizar}
            >
                Enviar para produção <kbd>{atalhos.enviar}</kbd>
            </button>

            <button type="button" className="btn btn-outline-info col-6" onClick={onRecuperar} disabled={carregando}>
                Recuperar pedido <kbd>{atalhos.recuperar}</kbd>
            </button>

            <button type="button" className="btn btn-outline-secondary col-6" onClick={onLimpar} disabled={carregando}>
                Limpar venda <kbd>{atalhos.limpar}</kbd>
            </button>
        </div>
    );
}

export default MiniPdvAcoes;
