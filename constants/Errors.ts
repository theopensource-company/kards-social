export class UnsupportedActionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnsupportedActionError';
    }
}

export class UnexpectedResponse extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnexpectedResponse';
    }
}

export class MissingAuthenticationError extends Error {
    constructor(message?: string) {
        super(message || 'You are not authenticated');
        this.name = 'MissingAuthenticationError';
    }
}

export class MissingAuthorizationError extends Error {
    constructor(message?: string) {
        super(message || 'You are not authorized to perform this action');
        this.name = 'MissingAuthorizationError';
    }
}
