import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiKey = ''

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'anthropic-proxy',
      configureServer(server) {
        server.middlewares.use('/api/anthropic', async (req, res) => {
          const chunks: Buffer[] = []
          req.on('data', (chunk: Buffer) => chunks.push(chunk))
          req.on('end', async () => {
            const body = Buffer.concat(chunks).toString()
            try {
              const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': apiKey,
                  'anthropic-version': '2023-06-01',
                },
                body,
              })
              res.statusCode = response.status
              res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
              const reader = response.body!.getReader()
              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                res.write(value)
              }
              res.end()
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Proxy error' }))
            }
          })
        })
      },
    },
  ],
})
