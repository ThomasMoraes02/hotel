import pgPromise from "pg-promise";
import DatabaseConnection from "./DatabaseConnection";

export default class PgPromiseAdapter implements DatabaseConnection {
    private connection: pgPromise.IDatabase<any>;

    constructor(connection: string) {
        const pgp = pgPromise();
        this.connection = pgp(connection);
    }

    query(statement: string, params?: any): Promise<any> {
        return this.connection.query(statement, params);
    }

    close(): Promise<void> {
        return this.connection.$pool.end();
    }
}