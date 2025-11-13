import { createClient } from '@sstraatemans/sw_trpcclient';
import dotenv from 'dotenv';

dotenv.config();

console.log('TRPC_SERVER_URL:', process.env.TRPC_SERVER_URL);
export const trpcClient = createClient({
  url: process.env.TRPC_SERVER_URL!,
});
