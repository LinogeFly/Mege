import { Subject } from "rxjs";

export enum AlertType {
    Error,
    Success
}

export interface Alert {
    text: string;
    type: AlertType
}

const alertSubject = new Subject<Alert | undefined>();

function onAlert() {
    return alertSubject.asObservable();
}

function error(message: string) {
    alertSubject.next({
        text: message,
        type: AlertType.Error
    });
}

function success(message: string) {
    alertSubject.next({
        text: message,
        type: AlertType.Success
    });
}

function clear() {
    return alertSubject.next(undefined);
}

export const alertService = {
    onAlert,
    error,
    success,
    clear
};
