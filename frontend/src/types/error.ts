export type ErrorBodyItem = {
    msg?: string
}

export interface ErrorBody {
    details?: ErrorBodyItem[]
    detail?: string
}

export class NetworkError extends window.Error {
    body: ErrorBody
    status: number

    constructor(body: ErrorBody, status: number) {
        super();
        this.body = body;
        this.status = status;
    }
}