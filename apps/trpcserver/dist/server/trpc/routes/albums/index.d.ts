import z from 'zod';
export declare const albumsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../../context.js").Context;
    meta: object;
    errorShape: {
        data: {
            zodError: z.z.core.$ZodFlattenedError<unknown, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        message: string;
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: true;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    all: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            number: number;
            id: number;
            title: string;
            date: string;
        }[];
        meta: object;
    }>;
}>>;
//# sourceMappingURL=index.d.ts.map