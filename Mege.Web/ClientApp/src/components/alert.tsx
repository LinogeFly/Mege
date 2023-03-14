import React, { useEffect, useState } from "react";
import { alertService, Alert as AlertItem, AlertType } from "../services/alert";

function Alert() {
    const [alert, setAlert] = useState<AlertItem>();

    useEffect(() => {
        const alertsSubscription = alertService.onAlert().subscribe(newAlert => {
            if (newAlert) {
                setAlert(newAlert);
                return;
            }

            // Clear only success alerts
            if (alert?.type === AlertType.Success)
                setAlert(undefined);
        });

        return () => {
            alertsSubscription.unsubscribe();
        };
    }, [alert])

    function getAlertTypeClassFor(alert: AlertItem) {
        switch (alert.type) {
            case AlertType.Error:
                return "alert-danger";
            case AlertType.Success:
                return "alert-success";
            default:
                throw Error(`Not supported alert type "${alert.type}".`);
        }
    }

    function handleCloseClick() {
        setAlert(undefined);
    }

    return (
        <>
            {alert && <div className={"alert " + getAlertTypeClassFor(alert) + " alert-dismissible"} role="alert">
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={handleCloseClick}></button>
                {alert.text}
            </div>}
        </>
    );
}

export default Alert;