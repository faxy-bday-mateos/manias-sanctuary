import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              debugName: 'firebase-dependencies',
              name: (id) => {
                const packagePath = id.match(/node_modules[\\/](?:@firebase[\\/])?([^\\/]+)/)?.[1]
                return packagePath ? `firebase-${packagePath.replace(/[^a-zA-Z0-9_-]/g, '-')}` : null
              },
              test: /node_modules[\\/](?:@firebase|firebase)[\\/]/,
              minSize: 20 * 1024,
              maxSize: 400 * 1024,
              entriesAware: true,
              entriesAwareMergeThreshold: 10 * 1024,
            },
          ],
        },
      },
    },
  },
})
