# @go2asia/logger

Unified logger with requestId support for Go2Asia services.

## Usage

```typescript
import { createLogger, getRequestId, generateRequestId } from '@go2asia/logger';

// In Cloudflare Worker
export default {
  async fetch(request: Request): Promise<Response> {
    const requestId = getRequestId(request) || generateRequestId();
    const logger = createLogger(requestId, 'my-service');
    
    logger.info('Processing request', { userId: '123' });
    logger.error('Something went wrong', error, { endpoint: '/api/test' });
    
    return new Response('OK');
  }
};
```

## Features

- RequestId support for request tracing
- Structured logging (JSON context)
- Compatible with Cloudflare Workers runtime
- Type-safe logging API





