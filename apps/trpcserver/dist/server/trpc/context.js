export function createContext(opts) {
    const { req, res: reply } = opts;
    return { req, reply };
}
