export const getCacheStrategy = () => ({
  cacheStrategy: { ttl: 60 * 60 * 24 * 365, swr: 300 },
});
