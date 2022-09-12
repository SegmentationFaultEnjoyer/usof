import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src'
        },
        //TODO make this work
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                    @import "@/styles/_functions.scss";
                    @import "@/styles/_placeholders.scss";
                    @import "@/styles/_mixins.scss";
                    `,
                }
            }
        }
    }
})
