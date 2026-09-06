import api from "./api";

const assinantes = new Set();
let controller = null;
let reconexao = null;

function notificarErro(error) {
    assinantes.forEach((assinante) => assinante.onErro?.(error));
}

function processarEvento(evento) {
    const linhas = evento.split("\n");
    let nomeEvento = "";
    let dados = "";

    for (const linha of linhas) {
        if (linha.startsWith("event:")) {
            nomeEvento = linha.slice(6).trim();
        }

        if (linha.startsWith("data:")) {
            dados += linha.slice(5).trim();
        }
    }

    if (!["novo-pedido", "pedido-pronto", "pedido-item-finalizado"].includes(nomeEvento) || !dados) {
        return;
    }

    try {
        const eventoProducao = JSON.parse(dados);

        assinantes.forEach((assinante) => {
            if (nomeEvento === "novo-pedido") {
                assinante.onNovoPedido?.(eventoProducao);
            } else if (nomeEvento === "pedido-pronto") {
                assinante.onPedidoPronto?.(eventoProducao);
            } else {
                assinante.onPedidoItemFinalizado?.(eventoProducao);
            }
        });
    } catch {
        notificarErro(new Error("Evento de produção inválido."));
    }
}

function agendarReconexao() {
    clearTimeout(reconexao);
    reconexao = setTimeout(() => {
        conectar();
    }, 3000);
}

async function conectar() {
    if (controller || assinantes.size === 0) {
        return;
    }

    const token = sessionStorage.getItem("operacionalToken");

    if (!token) {
        notificarErro(new Error("Token operacional não encontrado."));
        return;
    }

    const connectionController = new AbortController();
    controller = connectionController;

    try {
        const response = await fetch(`${api.defaults.baseURL}/eventos/producao`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "text/event-stream"
            },
            signal: connectionController.signal
        });

        if (!response.ok || !response.body) {
            throw new Error(`Falha ao conectar aos eventos de produção. HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!connectionController.signal.aborted) {
            const { value, done } = await reader.read();

            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });

            const eventos = buffer.split("\n\n");
            buffer = eventos.pop() || "";

            eventos.forEach(processarEvento);
        }
    } catch (error) {
        if (!connectionController.signal.aborted) {
            notificarErro(error);
        }
    } finally {
        if (controller === connectionController) {
            controller = null;
        }
    }

    if (assinantes.size > 0) {
        agendarReconexao();
    }
}

export function conectarEventosProducao(assinante = {}) {
    assinantes.add(assinante);
    conectar();

    return () => {
        assinantes.delete(assinante);

        if (assinantes.size > 0) {
            return;
        }

        clearTimeout(reconexao);
        reconexao = null;
        controller?.abort();
        controller = null;
    };
}
