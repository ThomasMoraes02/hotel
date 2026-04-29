export default interface DatabaseConnection {
    query(statement: string, params?: any): Promise<any>;
    ping(): Promise<boolean>;
    close(): Promise<void>;
}