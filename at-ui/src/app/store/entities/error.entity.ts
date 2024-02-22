export interface RequestError {
    code?: number;
    message: string;
}

export class RequestException extends Error implements RequestError {
    code: number;

    constructor(message?: string, code?: number, v?: RequestError) {
        if (message) {
            super(message);
            this.message = message;
            this.code = code;
        } else if (v) {
            super(v.message);
            this.message = v.message;
            this.code = v.code;
        } else {
            super('Unknown error!');
            this.message = 'Unknown error!';
        }
    }
}
