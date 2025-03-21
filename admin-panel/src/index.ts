import "dotenv/config";
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static'
import { logger } from 'hono/logger';
import { zValidator } from '@hono/zod-validator';
import { RequestIdParamSchema } from './types.js';
import { RequestTypeRepository } from './repositories/request-type.repository.js';

// Setup Hono app
const app = new Hono();
const requestTypeRepository = new RequestTypeRepository();

// Middleware
app.use('*', logger());

// Serve static files
app.use('/dist/*', serveStatic({ root: './' }));

// Helper to render HTML template
const renderHtmlTemplate = (title: string, page: string, data: any) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <link href="/dist/index.css" rel="stylesheet" />
        <script src="/dist/client.js" defer></script>
      </head>
      <body>
        <div id="root" data-initial-data='${JSON.stringify({ page, data })}'></div>
      </body>
    </html>
  `;
};

// HTML shell for client-side rendering
app.get('/', async (c) => {
  try {
    const stats = await requestTypeRepository.getStats();
    return c.html(renderHtmlTemplate('Admin Dashboard', 'dashboard', stats));
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return c.html(renderHtmlTemplate('Error', 'error', { 
      error: 'Failed to load dashboard data'
    }));
  }
});

app.get('/requests', async (c) => {
  try {
    const requests = await requestTypeRepository.getAllPendingRequests();
    return c.html(renderHtmlTemplate('Type Change Requests - Admin Panel', 'requests', requests));
  } catch (error) {
    console.error('Error fetching requests:', error);
    return c.html(renderHtmlTemplate('Error', 'error', { 
      error: 'Failed to load request data'
    }));
  }
});

app.get('/requests/:id', async (c) => {
  try {
    const requestId = c.req.param('id');
    const request = await requestTypeRepository.getRequestById(requestId);
    
    if (!request) {
      return c.redirect('/requests');
    }
    
    return c.html(renderHtmlTemplate('Request Details - Admin Panel', 'requestDetail', request));
  } catch (error) {
    console.error('Error fetching request details:', error);
    return c.html(renderHtmlTemplate('Error', 'error', { 
      error: 'Failed to load request details'
    }));
  }
});

// API endpoints
app.post(
  '/api/requests/:id/approve',
  zValidator('param', RequestIdParamSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    try {
      await requestTypeRepository.approveRequest(id);
      return c.json({ success: true, message: 'Request approved successfully' });
    } catch (error) {
      console.error('Error approving request:', error);
      return c.json({ success: false, message: 'Failed to approve request' }, 500);
    }
  }
);

// Export app type for client
export type AppType = typeof app;

// Start the server
const port = parseInt(process.env.PORT || '3232');
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});