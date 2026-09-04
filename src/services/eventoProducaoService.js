import api from "./api";

export function conectarEventosProducao({ onNovoPedido, onErro } = {}) {
    const controller = new AbortController();
    const token = sessionStorage.getItem("operacionalToken");

    if (!token) {
        onErro?.(new Error("Token operacional não encontrado."));
        return () => controller.abort();
    }

    let reconexao = null;

    async function conectar() {
        try {
            const response = await fetch(`${api.defaults.baseURL}/eventos/producao`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "text/event-stream"
                },
                signal: controller.signal
            });

            if (!response.ok || !response.body) {
                throw new Error(`Falha ao conectar aos eventos de produção. HTTP ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let buffer = "";

            while (!controller.signal.aborted) {
                const { value, done } = await reader.read();

                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });

                const eventos = buffer.split("\n\n");
                buffer = eventos.pop() || "";

                for (const evento of eventos) {
                    processarEvento(evento);
                }
            }
        } catch (error) {
            if (controller.signal.aborted) {
                return;
            }

            onErro?.(error);
        }

        if (!controller.signal.aborted) {
            reconectar();
        }
    }

    function reconectar() {
        clearTimeout(reconexao);

        reconexao = setTimeout(() => {
            conectar();
        }, 3000);
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

        if (nomeEvento !== "novo-pedido" || !dados) {
            return;
        }

        try {
            onNovoPedido?.(JSON.parse(dados));
        } catch {
            onErro?.(new Error("Evento de produção inválido."));
        }
    }

    conectar();

    return () => {
        clearTimeout(reconexao);
        controller.abort();
    };
}
