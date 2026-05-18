/**
 * App.tsx
 * Root component — owns all top-level state and controls which step is shown.
 *
 * Flow:  FactionPicker → PlaystyleForm → AdvicePanel
 *
 * State:
 *   step    — which step of the flow is currently visible
 *   faction — the faction the user selected in step 1
 *   advice  — the full AI response text, built up chunk by chunk
 *   loading — true while the initial AI response is streaming
 */

import { useState } from 'react'
import { FactionPicker } from './components/FactionPicker'
import { PlaystyleForm } from './components/PlaystyleForm'
import { AdvicePanel } from './components/AdvicePanel'
import { getArmyAdvice, type PlaystyleAnswers } from './lib/claude'
import type { Faction } from './lib/factions'

type Step = 'pick' | 'form' | 'advice'

function App() {
  const [step, setStep] = useState<Step>('pick')
  const [faction, setFaction] = useState<Faction | null>(null)
  const [advice, setAdvice] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleFactionSelect = (f: Faction) => {
    setFaction(f)
    setStep('form')
  }

  const handleFormSubmit = async (answers: PlaystyleAnswers) => {
    if (!faction) return
    setAdvice('')
    setLoading(true)
    setStep('advice')
    try {
      await getArmyAdvice(faction, answers, chunk => {
        setAdvice(prev => prev + chunk)
      })
    } catch (error) {
      setAdvice('Sorry, something went wrong while fetching your advice. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFaction(null)
    setAdvice('')
    setStep('pick')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-widest text-red-500 uppercase">⚔ Army Advisor</h1>
            <p className="text-xs text-gray-600">Warhammer 40,000 — 10th Edition</p>
          </div>
          <span className="text-xs text-gray-600 border border-gray-800 px-2 py-1 rounded hidden sm:block">Powered by Claude AI</span>
        </div>
      </header>

      {/* Step indicator*/}
      <div className="border-b border-gray-900 px-6 py-3">
        <div className="max-w-2xl mx-auto flex gap-6">
          {(['pick', 'form', 'advice'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? 'bg-red-700 text-white' :
                (['pick', 'form', 'advice'].indexOf(step) > i) ? 'bg-gray-700 text-gray-300' :
                'bg-gray-900 text-gray-600 border border-gray-800'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === s ? 'text-gray-300' : 'text-gray-600'}`}>
                {s === 'pick' ? 'Faction' : s === 'form' ? 'Playstyle' : 'Advice'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="px-6 py-10 pb-20">  
        {step === 'pick' && <FactionPicker onSelect={handleFactionSelect} />}
        {step === 'form' && faction && (
          <PlaystyleForm
            faction={faction}
            onSubmit={handleFormSubmit}
            onBack={() => setStep('pick')}
          />
        )}
        {step === 'advice' && faction && (
          <AdvicePanel
            faction={faction}
            advice={advice}
            loading={loading}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-900 bg-gray-950 px-6 py-3">
        <p className="text-center text-xs text-gray-700">
          Built with React + TypeScript + Claude AI · Warhammer 40,000 is © Games Workshop
        </p>
      </footer>
    </div>
  )
}

export default App
