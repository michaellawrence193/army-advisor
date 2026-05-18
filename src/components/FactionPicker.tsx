/**
 * FactionPicker
 * Step 1 of the advisor flow.
 * Displays all factions in a filterable, searchable grid.
 * Calls onSelect with the chosen faction to advance to step 2.
 */

import { useState } from 'react'
import { FACTIONS, ALLEGIANCES, type Faction } from '../lib/factions'

type Props = {
    onSelect: (faction: Faction) => void
}

export function FactionPicker({ onSelect }: Props) {
    const [filter, setFilter] = useState<string>('All')
    const [search, setSearch] = useState('')

    // Filter factions by allegiance tab and search input
    // both filters are applied together
    const visible = FACTIONS.filter(f => {
        const matchesAllegiance = filter === 'All' || f.allegiance === filter
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase())
        return matchesAllegiance && matchesSearch
    })

    return (
        <div className="w-full max-w-2x1 mx-auto">
            <h2 className="text-2x1 font-bold mb-1">Choose your faction</h2>
            <p className="text-gray-400 mb-6">Select the army you want to build or are interested in</p>

            <div className="flex gap-2 mb-4 flex-wrap">
                {['All', ...ALLEGIANCES].map(a => (
                    <button
                        key={a}
                        onClick={() => setFilter(a)}
                        className={`btn-pill ${filter === a ? 'active' : ''}`}
                        >
                        {a}
                    </button>
                ))}
            </div>

            <input
                type="text"
                placeholder="Search factions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input mb-4"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {visible.map(faction => (
                    <button
                        key={faction.id}
                        onClick={() => onSelect(faction)}
                        className="text-left p-4 rounded-lg border border-gray-800 hover:border-red-700 hover:bg-gray-900 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{faction.name}</span>
                            <span className={`badge badge-${faction.allegiance.toLowerCase()}`}>
                                {faction.allegiance}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400">{faction.playstyle}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}