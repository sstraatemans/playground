import { prisma } from '../../db/client.js';
export function createContext(opts) {
    const { req, res: reply } = opts;
    return { req, reply, prisma };
}
