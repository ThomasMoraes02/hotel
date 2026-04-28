import Cpf from "../value-objects/Cpf";
import Email from "../value-objects/Email";
import Password from "../value-objects/Password";
import Uuid from "../value-objects/Uuid";

export default class Guest {
    constructor(readonly uuid: Uuid, readonly name: string, readonly email: Email, readonly document: Cpf, readonly password: Password) {}
    
    static create(name: string, email: string, document: string, password: string) {
        const uuid = Uuid.create();
        const emailVO = new Email(email);
        const cpf = new Cpf(document);
        const pwd = new Password(password);
        return new Guest(uuid, name, emailVO, cpf, pwd);
    }

    static restore(id: string, name: string, email: string, document: string, password: string): Guest {
        const uuid = new Uuid(id);
        const emailVO = new Email(email);
        const cpf = new Cpf(document);
        const pwd = new Password(password);
        return new Guest(uuid, name, emailVO, cpf, pwd);
    }

    getName(): string {
        return this.name;
    }

    getUuid(): string {
        return this.uuid.getValue();
    }

    getEmail(): string {
        return this.email.getValue();
    }

    getDocument(): string {
        return this.document.getValue();
    }

    getPassword(): string {
        return this.password.getValue();
    }
}