import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        extensions: ['.mjs', '.js', '.jsx', '.json', '.scss'],
        dedupe: ['react'],
        alias: {
            '@api': '/api',
            '@': '/src',
            '@branding': '/static/branding',
            '@styles': '/src/styles'
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                @import "@styles/_animations.scss";
                @import "@styles/_functions.scss";
                @import "@styles/_placeholders.scss";
                @import "@styles/_mixins.scss";
                `,
            }
        }
    }
})
