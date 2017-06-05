import { Observable } from 'data/observable';
export class User extends Observable {
    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }

    get email(): string {
        return this.get("_email");
    }

    set email(value: string) {
        this.set("_email", value);
    }

    get password(): string {
        return this.get("_password");
    }

    set password(value: string) {
        this.set("_password", value);
    }
}