/**
 * factions.ts
 * Contains all Warhammer 40,000 10th Edition faction data.
 * Faction type defines the shape of each faction object.
 * FACTIONS is the master list used throughout the app.
 * ALLEGIANCES is used to drive the filter buttons in FactionPicker.
 */

export type Faction = {
    id: string
    name: string
    allegiance: 'Imperium' | 'Chaos' | 'Xenos'
    playstyle: string
}

export const FACTIONS: Faction[] = [
    { id: 'space-marines', name: 'Space Marines', allegiance: 'Imperium', playstyle: 'Versatile all-rounders' },
    { id: 'blood-angels', name: 'Blood Angels', allegiance: 'Imperium', playstyle: 'Aggressive melee' },
    { id: 'dark-angels', name: 'Dark Angels', allegiance: 'Imperium', playstyle: 'Balanced with secret tactics' },
    { id: 'space-wolves', name: 'Space Wolves', allegiance: 'Imperium', playstyle: 'Melee & psychic powers' },
    { id: 'black-templars', name: 'Black Templars', allegiance: 'Imperium', playstyle: 'Crusading melee' },
    { id: 'grey-knights', name: 'Grey Knights', allegiance: 'Imperium', playstyle: 'Elite daemon hunters' },
    { id: 'deathwatch', name: 'Deathwatch', allegiance: 'Imperium', playstyle: 'Specialist kill teams' },
    { id: 'sisters-of-battle', name: 'Sisters of Battle', allegiance: 'Imperium', playstyle: 'Faith-powered shooting' },
    { id: 'astra-militarum', name: 'Astra Militarum', allegiance: 'Imperium', playstyle: 'Horde infantry & tanks' },
    { id: 'adeptus-custodes', name: 'Adeptus Custodes', allegiance: 'Imperium', playstyle: 'Super-elite close combat' },
    { id: 'adeptus-mechanicus', name: 'Adeptus Mechanicus', allegiance: 'Imperium', playstyle: 'Tech & shooting' },
    { id: 'imperial-knights', name: 'Imperial Knights', allegiance: 'Imperium', playstyle: 'Big stompy robots' },
    { id: 'chaos-space-marines', name: 'Chaos Space Marines', allegiance: 'Chaos', playstyle: 'Versatile all-rounders w/ dark twist' },
    { id: 'world-eaters', name: 'World Eaters', allegiance: 'Chaos', playstyle: 'Pure berserker melee' },
    { id: 'death-guard', name: 'Death Guard', allegiance: 'Chaos', playstyle: 'Resilient attrition' },
    { id: 'thousand-sons', name: 'Thousand Sons', allegiance: 'Chaos', playstyle: 'Psychic power dominance' },
    { id: 'emperors-children', name: "Emperor's Children", allegiance: 'Chaos', playstyle: 'Fast melee & excess' },
    { id: 'chaos-knights', name: 'Chaos Knights', allegiance: 'Chaos', playstyle: 'Corrupted big stompy robots' },
    { id: 'daemons', name: 'Chaos Daemons', allegiance: 'Chaos', playstyle: 'Summoned melee horrors' },
    { id: 'necrons', name: 'Necrons', allegiance: 'Xenos', playstyle: 'Reanimating durability' },
    { id: 'orks', name: 'Orks', allegiance: 'Xenos', playstyle: 'Overwhelming melee hordes' },
    { id: 'tyranids', name: 'Tyranids', allegiance: 'Xenos', playstyle: 'Swarm tactics' },
    { id: 'genestealer-cults', name: 'Genestealer Cults', allegiance: 'Xenos', playstyle: 'Ambush & infiltration' },
    { id: 'tau', name: 'Tau', allegiance: 'Xenos', playstyle: 'Long-range shooting' },
    { id: 'aeldari', name: 'Aeldari', allegiance: 'Xenos', playstyle: 'Fast & precise' },
    { id: 'drukhari', name: 'Drukhari', allegiance: 'Xenos', playstyle: 'Elusive hit-and-run' },
    { id: 'leagues-of-votann', name: 'Leagues of Votann', allegiance: 'Xenos', playstyle: 'Grudge-fueled shooting' },
]

export const ALLEGIANCES = ['Imperium', 'Chaos', 'Xenos'] as const