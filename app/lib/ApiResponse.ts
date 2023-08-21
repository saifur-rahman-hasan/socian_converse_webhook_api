import {NextApiRequest, NextApiResponse} from 'next';

export class ApiResponse<T> {
    private success: boolean;
    private message: string;
    private data: T | null;

    constructor(success: boolean, message: string, data: T | null = null) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    static success<T>(res: NextApiResponse, data: T, message: string = ''): void {
        const response = new ApiResponse<T>(true, message, data);
        res.status(200).json(response.toJSON());
        return;
    }

    static error<T>(res: NextApiResponse, error: Error|string, data: any = null): void {
        const message = typeof error === 'string' ? error : error?.message || 'Internal Server Error';
        const response = new ApiResponse<T>(false, message, data);
        return res.status(500).json(response.toJSON());
    }

    static created<T>(res: NextApiResponse, message: any, data: T): void {
        const response = new ApiResponse<T>(true, message, data);
        res.status(201).json(response.toJSON());
        return;
    }

    static deleted<T>(res: NextApiResponse, message?: string): void {
        const response = new ApiResponse<T>(true, message || 'Resource Deleted');
        res.status(204).json(response.toJSON());
        return;
    }

    static notFound<T>(res: NextApiResponse, message: any, data: T): void {
        const response = new ApiResponse<T>(false, message || 'Resource Not Found.', data);
        res.status(404).json(response.toJSON());
        return;
    }

    static methodNotAllowed<T>(res: NextApiResponse, req: NextApiRequest|string): void {
        const method = typeof req === 'string' ? req : req.method
        const response = new ApiResponse<T>(false, `Method ${method} Not Allowed`);
        res.status(405).json(response.toJSON());
        return;
    }

    static unauthorized<T>(res: NextApiResponse, message?: string): void {
        const response = new ApiResponse<T>(false, message || 'Unauthorized');
        res.status(401).json(response.toJSON());
        return;
    }

    static forbidden<T>(res: NextApiResponse, message?: string): void {
        const response = new ApiResponse<T>(false, message || 'Forbidden');
        res.status(403).json(response.toJSON());
        return;
    }

    static badRequest<T>(res: NextApiResponse, message?: string): void {
        const response = new ApiResponse<T>(false, message || 'Bad Request');
        res.status(400).json(response.toJSON());
        return;
    }

    static conflict<T>(res: NextApiResponse, message?: string): void {
        const response = new ApiResponse<T>(false, message || 'Conflict');
        res.status(409).json(response.toJSON());
        return;
    }

    toJSON(): Record<string, any> {
        return {
            success: this.success,
            message: this.message,
            data: this.data,
        };
    }
}
