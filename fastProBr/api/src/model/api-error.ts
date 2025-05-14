enum ApiErrorStatusCode {
    '400_BAD_REQUEST' = 400,
    '401_UNAUTHORIZED' = 401,
    '403_FORBIDDEN' = 403,
    '404_NOT_FOUND' = 404,
    '500_INTERNAL_SERVER_ERROR' = 500,
    '501_NOT_IMPLEMENTED' = 501,
}

type ApiErrorResponse = {
    message: string;
    statusCode: number;
};

export class ApiError extends Error {
    constructor(statusCode: keyof typeof ApiErrorStatusCode, message: string) {
        super(message);
        this.statusCode = ApiErrorStatusCode[statusCode];
    }

    statusCode: number;

    getResponseMessage(): ApiErrorResponse {
        return {
            message: this.message,
            statusCode: this.statusCode,
        };
    }

    static getUnhandlerErrorMessage(): ApiErrorResponse {
        return {
            message: 'Unknown error',
            statusCode: 500,
        };
    }
}
