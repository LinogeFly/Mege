import axios from "axios";
import React, { useEffect, useState } from "react";
import { alertService } from "../../services/alert";
import auth from "../../services/auth";
import { logError } from "../../services/logger";

function Logout() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();

        auth.logout({ signal: abortController.signal })
            .then(() => setLoading(false))
            .catch((error) => {
                if (axios.isCancel(error))
                    return;

                alertService.error("Unable to log out. Try again later.");
                logError(error);
            });

        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <>
            {loading && <div>Logging out...</div>}
            {!loading && <div>You are now logged out.</div>}
        </>
    )
}

export default Logout;