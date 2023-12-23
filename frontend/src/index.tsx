// External imports
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Local imports
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './app';
import initI18n from './lang';
import './styles/main.scss';
import { worker } from './mocks/server';

const queryClient = new QueryClient();

// Global initialization
initI18n();

const htmlRoot = document.getElementById('root') as HTMLElement;
const reactRoot = ReactDOM.createRoot(htmlRoot);

// worker.start();

console.log(import.meta.env);

reactRoot.render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </BrowserRouter>,
);
