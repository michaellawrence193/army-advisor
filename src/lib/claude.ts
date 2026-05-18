/**
 * claude.ts
 * Handles all communication with the Anthropic Claude API.
 *
 * getArmyAdvice  — sends the initial army advice request as a streaming response.
 * sendFollowUp   — sends follow-up messages with full conversation history,
 *                  allowing the user to ask questions after the initial advice.
 *
 * Both functions accept an onChunk callback that fires on each streamed token,
 * which lets the UI update in real time as the response arrives.
 */

import type { Faction } from './factions'

export type PlaystyleAnswers = {
    experience: string
    preferredStyle: string
    budget: string
    pointsLimit: string
    goals: string
}

export type Message = {
    role: 'user' | 'assistant'
    content: string
}

export async function getArmyAdvice(
    faction: Faction,
    answers: PlaystyleAnswers,
    onChunk: (text: string) => void
): Promise<void> {

    // Build a structured prompt that gives Claude the context it needs
    // to give specific, useful advice rather than generic responses
    const prompt = `You are an expert Warhammer 40,000 10th Edition army advisor. 
    Give practical, specific advice for the following player. 

    Faction: ${faction.name} 
    Experience: ${answers.experience} 
    Preferred playstyle: ${answers.preferredStyle} 
    Budget: ${answers.budget} 
    Points limit: ${answers.pointsLimit} 
    Goals: ${answers.goals} 
    
    Provide: 
    1. A brief overview of why this faction suits them 
    2. A recommended starting units list (with appoximate points costs) 
    3. Key synergies to build around 
    4. One beginner tip specific to this faction 
    5. One competitive tip for 10th edition 

    Be specific, encouraging, and practical. Format with clear sections.`

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
        }),
    })

    if (!response.ok) throw new Error('API request failed')
    
    const data = await response.json()
    // Fire the callback wuth the full response text
    onChunk(data.content[0].text)
}

export async function sendFollowUp(
    messages: Message[],
    faction: Faction,
    onChunk: (text: string) => void
): Promise<void> {
    const systemPrompt = `You are an expert Warhammer 40,000 10th Edition army advisor specializing in ${faction.name}.
    You have already provided initial army advice to this player.
    Answer their follow-up questions with specific, practical advice. Be concise but thorough.`

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
    })

    if (!response.ok) throw new Error('API request failed')

    const data = await response.json()
    onChunk(data.content[0].text)
}