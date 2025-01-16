// Import your main CSS
import '../css/app.css'; // This file should include @font-face for Adys and other global styles
import './bootstrap'; // Bootstrap any necessary JavaScript

// Import Inertia helpers
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Get the app name from environment variables
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Create the Inertia app
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
