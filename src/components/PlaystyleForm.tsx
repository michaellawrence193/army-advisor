/**
 * PlaystyleForm
 * Step 2 of the advisor flow.
 * Collects the player's experience, playstyle preferences, budget,
 * points limit, and goals via button selects and a text area.
 * The submit button stays disabled until all fields are filled.
 * Calls onSubmit with the completed answers to trigger the AI request.
 */

import { useState } from 'react'
import type { PlaystyleAnswers } from '../lib/claude'
import type { Faction } from '../lib/factions'

type Props = {
    faction: Faction
    onSubmit: (answers: PlaystyleAnswers) => void
    onBack: () => void
}

export function PlaystyleForm({ faction, onSubmit, onBack }: Props) {
    const [answers, setAnswers] = useState<PlaystyleAnswers>({
        experience: '',
        preferredStyle: '',
        budget: '',
        pointsLimit: '',
        goals: '',
    })

    // Convenience updater — merges a single field into the answers state
    // without overwriting the other fields
    const set = (key: keyof PlaystyleAnswers, value: string) => 
        setAnswers(prev => ({ ...prev, [key]: value }))

    // Only enable the submit button when every field has a value
    const ready = Object.values(answers).every(v => v.trim() !== '')

    return (
        <div className="w-full max-w-xl mx-auto">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-300 text-sm mb-6 flex items-center gap-1">
                ← Back
            </button>

            <h2 className="text-2xl font-bold mb-1">{faction.name}</h2>
            <p className="text-gray-400 mb-8">Tell us about yourself so we can tailor your list</p>

            <div className="flex flex-col gap-6">
                <div>
                    <label className="label">Experience level</label>
                    <div className="flex gap-2 flex-wrap">
                        {['Complete beginner', 'Some games played', 'Intermediate', 'Veteran'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => set('experience', opt)}
                                className={`btn-pill ${answers.experience === opt ? 'active' : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="label">Preferred playstyle</label>
                    <div className="flex gap-2 flex-wrap">
                        {['Aggressive melee', 'Shooting & range', 'Balanced', 'Defensive & resilient', 'Tricky & tactical'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => set('preferredStyle', opt)}
                                className={`btn-pill ${answers.preferredStyle === opt ? 'active' : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="label">Hobby budget</label>
                    <div className="flex gap-2 flex-wrap">
                        {['Under $100', '$100–$300', '$300–$600', '$600+'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => set('budget', opt)}
                                className={`btn-pill ${answers.budget === opt ? 'active' : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="label">Points limit</label>
                    <div className="flex gap-2 flex-wrap">
                        {['500pts (Combat Patrol)', '1000pts', '1500pts', '2000pts (Standard)'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => set('pointsLimit', opt)}
                               className={`btn-pill ${answers.pointsLimit === opt ? 'active' : ''}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="label">What's your main goal?</label>
                    <textarea
                        value={answers.goals}
                        onChange={e => set('goals', e.target.value)}
                        placeholder="E.g. I want to win local tournaments, or I just want a cool themed army..."
                        rows={3}
                        className="input resize-none"
                    />
                </div>

                <button
                    onClick={() => ready &&onSubmit(answers)}
                    disabled={!ready}
                    className="w-full py-3 rounded-lg font-medium transition-colors btn-primary"
                >
                    Get my personalized army advice
                </button>

            </div>
        </div>
    )
}