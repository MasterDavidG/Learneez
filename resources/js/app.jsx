import '../css/app.css';
import './bootstrap';
import '../css/AuthenticatedLayout.css'; // Your layout styles

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Get the app name from environment variables
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el); // Create a root for React
        root.render(<App {...props} />); // Render the Inertia app
    },
    progress: {
        color: '#4B5563', // Custom progress bar color
    },
});
