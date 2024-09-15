export declare class Password {
    static toHash(password: any): Promise<string>;
    static compare(storedPassword: string, suppliedPassword: string): Promise<boolean>;
    static encrypt(providedPassword: string): Promise<string>;
    static verify(passwordProvided: string, hash: string): Promise<boolean>;
}
