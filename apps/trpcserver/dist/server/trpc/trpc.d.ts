import superjson from 'superjson';
import { Context } from './context.js';
export declare const t: import("@trpc/server").TRPCRootObject<Context, object, {
    transformer: typeof superjson;
    errorFormatter({ shape, error }: {
        error: import("@trpc/server").TRPCError;
        type: import("@trpc/server").ProcedureType | "unknown";
        path: string | undefined;
        input: unknown;
        ctx: Context | undefined;
        shape: import("@trpc/server").TRPCDefaultErrorShape;
    }): {
        data: {
            zodError: import("zod").ZodFlattenedError<unknown, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        message: string;
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
}, {
    ctx: Context;
    meta: object;
    errorShape: {
        data: {
            zodError: import("zod").ZodFlattenedError<unknown, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        message: string;
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: true;
}>;
/** Helper types */
export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: Context;
    meta: object;
    errorShape: {
        data: {
            zodError: import("zod").ZodFlattenedError<unknown, string> | null;
            code: import("@trpc/server").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
            stack?: string;
        };
        message: string;
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: true;
}>;
export type Router = typeof router;
export type Procedure = typeof procedure;
export declare const procedure: import("@trpc/server").TRPCProcedureBuilder<Context, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map