import HttpClient from "./HttpClient";
import axios from "axios";

export default class AxiosAdapter implements HttpClient {
    async get(url: string, options?: any): Promise<any> {
        const response = await axios.get(url, options);
        return response.data;
    }
}