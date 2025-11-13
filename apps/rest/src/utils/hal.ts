/**
 * Utility functions for building HAL+JSON responses
 */

export interface HalLink {
  href: string;
  templated?: boolean;
}

export interface HalLinks {
  [key: string]: HalLink;
}

export interface PaginationParams {
  limit: number;
  offset: number;
  totalCount: number;
  baseUrl: string;
}

/**
 * Build HAL pagination links for collection responses
 */
export function buildPaginationLinks({
  limit,
  offset,
  totalCount,
  baseUrl,
}: PaginationParams): HalLinks {
  const selfUrl = `${baseUrl}?limit=${limit}&offset=${offset}`;
  const firstUrl = `${baseUrl}?limit=${limit}&offset=0`;

  // Calculate last page offset
  const lastOffset = Math.max(0, Math.floor((totalCount - 1) / limit) * limit);
  const lastUrl = `${baseUrl}?limit=${limit}&offset=${lastOffset}`;

  // Calculate next and prev
  const nextOffset = offset + limit;
  const prevOffset = Math.max(0, offset - limit);

  const links: HalLinks = {
    self: { href: selfUrl },
    first: { href: firstUrl },
    last: { href: lastUrl },
    collection: { href: baseUrl },
  };

  // Only add next if there are more items
  if (nextOffset < totalCount) {
    links.next = { href: `${baseUrl}?limit=${limit}&offset=${nextOffset}` };
  }

  // Only add prev if we're not on the first page
  if (offset > 0) {
    links.prev = { href: `${baseUrl}?limit=${limit}&offset=${prevOffset}` };
  }

  return links;
}

/**
 * Build HAL links for a single resource
 */
export function buildResourceLinks(
  selfUrl: string,
  collectionUrl: string
): HalLinks {
  return {
    self: { href: selfUrl },
    collection: { href: collectionUrl },
  };
}

/**
 * Build error response following HAL+JSON conventions
 */
export function buildErrorResponse(
  code: string,
  message: string,
  selfUrl: string
) {
  return {
    error: { code, message },
    _links: { self: { href: selfUrl } },
  };
}

/**
 * Validate and parse pagination parameters
 */
export function parsePaginationParams(
  limit?: string | null,
  offset?: string | null
): { limit: number; offset: number; error?: string } {
  const parsedLimit = limit ? parseInt(limit, 10) : 50;
  const parsedOffset = offset ? parseInt(offset, 10) : 0;

  if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
    return { limit: 50, offset: 0, error: 'Invalid pagination parameters' };
  }

  if (parsedLimit < 1 || parsedLimit > 100) {
    return { limit: 50, offset: 0, error: 'Limit must be between 1 and 100' };
  }

  if (parsedOffset < 0) {
    return { limit: 50, offset: 0, error: 'Offset must be non-negative' };
  }

  return { limit: parsedLimit, offset: parsedOffset };
}
