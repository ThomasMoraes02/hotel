import HttpClient from "./HttpClient";

export default class FetchAdapter implements HttpClient {
    async get(url: string, options?: any): Promise<any> {
        const response = await fetch(url, {
            method: 'GET',
            headers: options?.headers || {}
        });
        return await response.json();
    }

    async post(url: string, data: any, options?: any): Promise<any> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {})
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async put(url: string, data: any, options?: any): Promise<any> {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {})
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }
}
