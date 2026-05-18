/**
 * AdvicePanel
 * Step 3 of the advisor flow.
 * Displays the initial streaming AI response, then renders a chat
 * interface below it for follow-up questions.
 *
 * State:
 *   messages       — conversation history for follow-up exchanges
 *   input          — current value of the follow-up input field
 *   followUpLoading — true while a follow-up response is streaming
 *
 * The bottomRef ensures the view scrolls to the latest message
 * automatically as new content streams in.
 */

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { sendFollowUp, type Message } from '../lib/claude'
import type { Faction } from '../lib/factions'

type Props = {
    faction: Faction
    advice: string
    loading: boolean
    onReset: () => void
}

export function AdvicePanel({ faction, advice, loading, onReset }: Props) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [followUpLoading, setFollowUpLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    const allegiance = faction.allegiance

        useEffect(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, [messages, advice])

        const handleSend = async () => {
            if (!input.trim() || followUpLoading) return

        const userMessage: Message = { role: 'user', content: input.trim() }

        // Prepend the initial advice as context so Claude remembers
        // what was already recommended when answering follow-ups
        const updatedMessages: Message[] = [
            { role: 'user', content: `Initial advice received:\n${advice}` },
            ...messages,
            userMessage,
        ]

        setMessages(prev => [...prev, userMessage, { role: 'assistant', content: '' }])
        setInput('')
        setFollowUpLoading(true)

        try {
            await sendFollowUp(updatedMessages, faction, chunk => {
                setMessages(prev => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                        role: 'assistant',
                        content: updated[updated.length - 1].content + chunk,
                    }
                    return updated
                })
            })
        } catch (error) {
            setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                    role: 'assistant',
                    content: 'Sorry, something went. Please try again.',
                }
                return updated
            })
        } finally {
            setFollowUpLoading(false)
        }
    }

    const mdClassName = 'md-content'

    return (
        <div className="w-full max-w-2x1 mx-auto">

            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold">{faction.name}</h2>
                     <span className={`badge badge-${allegiance.toLowerCase()}`}>
                        {allegiance}
                     </span>
                    </div>
                    <p className="text-gray-400 text-sm">{faction.playstyle}</p>
                </div>
                <button
                    onClick={onReset}
                    className="btn-ghost whitespace-nowrap"
                >
                    Start over
                </button>
            </div>

            {/* Initial advice */}
            <div className="panel mb-4">
                {loading && advice === '' && (
                    <div className="flex gap-2 items-center text-gray-500 text-sm">
                        <span className="animate-pulse">Consulting the strategium</span>
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-100">.</span>
                        <span className="animate-bounce delay-200">.</span>
                    </div>
                )}
                {advice && (
                    <div className={mdClassName}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{advice}</ReactMarkdown>
                    </div>
                )}
            </div>
            
            {/* Follow-up messages */}
            {messages.length > 0 && (
                <div className="flex flex-col gap-4 mb-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`rounded-xl p-4 ${
                            msg.role === 'user'
                                ? 'bg-gray-800 border border-gray-700 ml-8'
                                : 'bg-gray-900 border border-gray-800'
                        }`}>
                            <p className={`text-xs font-semibold mb-2 ${
                                msg.role === 'user' ? 'text-gray-400' : 'text-red-500'
                            }`}>
                                {msg.role === 'user' ? 'You' : 'Army Advisor'}
                            </p>
                            {msg.role === 'assistant' ? (
                                <div className={mdClassName}>
                                    {msg.content === '' && followUpLoading ? (
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <span className="animate-pulse">Thinking</span>
                                            <span className="animate-bounce">.</span>
                                            <span className="animate-bounce delay-100">.</span>
                                            <span className="animate-bounce delay-200">.</span>
                                        </div>
                                    ) : (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-300">{msg.content}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div ref={bottomRef} />

            {/* Input box - only show if initial advice is done */}
            {!loading && advice && (
                <div className="sticky bottom-16 bg-gray-950 pt-2 pb-1">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key ==='Enter' && handleSend()}
                            placeholder="Ask a follow-up question or request more advice..."
                            disabled={followUpLoading}
                            className="flex-1 input"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || followUpLoading}
                            className="btn-primary whitespace-nowrap"
                        >
                            Send
                        </button>
                    </div>
                    <p className="text-xs text-gray-700 mt-2 text-center">
                        AI-generated advice for 10th Edition — always verify points costs with the official app
                    </p>
                </div>
            )}

        </div>
    )
}