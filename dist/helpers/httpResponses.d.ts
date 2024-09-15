export declare const successResponse: (message: string, data: object | null, meta?: object) => {
    status: boolean;
    message: string;
    data: object | null;
    meta: object | undefined;
};
export declare const errorResponse: (message: string, data?: any[]) => {
    status: boolean;
    message: string;
    data: any[] | undefined;
};
