import { DomainError } from "./DomainError";

export class ForbiddenOperationError extends DomainError {
    readonly name = 'ForbiddenOparationError';

    constructor(message: string) {
        super(message);
    }
}