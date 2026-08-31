import { useCallback, useState } from "react";

function useKeyboardAlert() {
    const [alertState, setAlertState] = useState({
        open: false,
        message: ""
    });

    const showAlert = useCallback((message) => {
        setAlertState({
            open: true,
            message: String(message || "")
        });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertState({
            open: false,
            message: ""
        });
    }, []);

    return {
        alertState,
        showAlert,
        closeAlert
    };
}

export default useKeyboardAlert;
