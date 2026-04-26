export default interface HttpClient {
    get(url: string, options?: any): Promise<any>;
}