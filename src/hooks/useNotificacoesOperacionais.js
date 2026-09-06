import { useContext } from "react";

import NotificacoesOperacionaisContext from "../context/notificacoesOperacionaisContext";

function useNotificacoesOperacionais() {
    const contexto = useContext(NotificacoesOperacionaisContext);

    if (!contexto) {
        throw new Error("useNotificacoesOperacionais deve ser usado dentro de NotificacoesOperacionaisProvider.");
    }

    return contexto;
}

export default useNotificacoesOperacionais;
