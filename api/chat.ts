/**
 * api/chat.ts
 * Vercel serverless function — acts as a secure proxy between the
 * frontend and the Anthropic API. The API key never touches the browser.
 * Vercel runs this as a Node.js function on their servers.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' })
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(req.body),
        })

        const data = await response.json()
        return res.status(response.status).json(data)
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' })
    }
}
