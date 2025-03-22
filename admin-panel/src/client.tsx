import { render } from 'hono/jsx/dom';
import {
  Layout,
  Dashboard,
  RequestList,
  RequestDetail,
  ErrorPage
} from './components/index.js';

// Main App component
function App() {
  // Get initial data passed from the server
  const rootElement = document.getElementById('root');
  const initialDataStr = rootElement?.getAttribute('data-initial-data') || '{}';
  let initialData;
  try {
    initialData = JSON.parse(initialDataStr);
  } catch (e) {
    initialData = { page: 'error', error: 'Failed to parse data' };
    console.error('Failed to parse initial data:', e);
  }

  // Determine which page to render based on the data
  const renderPage = () => {
    switch (initialData.page) {
      case 'dashboard':
        return <Layout title="Dashboard">
          <Dashboard stats={initialData.data} />
        </Layout>;

      case 'requests':
        return <Layout title="Type Change Requests">
          <RequestList requests={initialData.data} />
        </Layout>;

      case 'requestDetail':
        return <Layout title="Request Details">
          <RequestDetail request={initialData.data} />
        </Layout>;

      case 'error':
        return <Layout title="Error">
          <ErrorPage error={initialData.error || 'Unknown error'} />
        </Layout>;

      default:
        return <Layout title="Unknown Page">
          <ErrorPage error="Unknown page requested" />
        </Layout>;
    }
  };

  return renderPage();
}

// Mount the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    render(<App />, root);
  }
});