export type GardenRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
export type GardenHabitatId = 'meadow' | 'lakeshore' | 'lantern-grove'

export type GardenHabitat = {
  id: GardenHabitatId
  name: string
  description: string
}

export const gardenHabitats: readonly GardenHabitat[] = [
  {
    id: 'meadow',
    name: 'Moonlit Meadow',
    description: 'Soft grass, open sky, and the first scattered blooms.',
  },
  {
    id: 'lakeshore',
    name: 'Silver Lakeshore',
    description: 'A quiet shoreline where cool colors shimmer on the water.',
  },
  {
    id: 'lantern-grove',
    name: 'Lantern Grove',
    description: 'A sheltered grove with warm leaves and little points of light.',
  },
]

export type ButterflySpecies = {
  id: string
  name: string
  scientificName: string
  region: string
  rarity: GardenRarity
  habitats: readonly GardenHabitatId[]
  wing: string
  detail: string
}

export const butterflySpecies = [
  { id: 'monarch', name: 'Monarch', scientificName: 'Danaus plexippus', region: 'North and Central America', rarity: 'Common', habitats: ['meadow', 'lakeshore'], wing: '#e98538', detail: '#382d2a' },
  { id: 'painted-lady', name: 'Painted Lady', scientificName: 'Vanessa cardui', region: 'Every continent except Antarctica', rarity: 'Common', habitats: ['meadow'], wing: '#db8c55', detail: '#463d3a' },
  { id: 'red-admiral', name: 'Red Admiral', scientificName: 'Vanessa atalanta', region: 'Europe, Asia, and North America', rarity: 'Common', habitats: ['meadow', 'lantern-grove'], wing: '#302c3f', detail: '#e17d55' },
  { id: 'common-blue', name: 'Common Blue', scientificName: 'Polyommatus icarus', region: 'Europe and temperate Asia', rarity: 'Common', habitats: ['meadow'], wing: '#728fc8', detail: '#e4d7b6' },
  { id: 'common-grass-yellow', name: 'Common Grass Yellow', scientificName: 'Eurema hecabe', region: 'Africa, Asia, and Australia', rarity: 'Common', habitats: ['meadow'], wing: '#e7ca52', detail: '#806b36' },
  { id: 'old-world-swallowtail', name: 'Old World Swallowtail', scientificName: 'Papilio machaon', region: 'Europe, Asia, and North America', rarity: 'Uncommon', habitats: ['meadow', 'lakeshore'], wing: '#e9d76d', detail: '#302e38' },
  { id: 'common-buckeye', name: 'Common Buckeye', scientificName: 'Junonia coenia', region: 'North America', rarity: 'Uncommon', habitats: ['meadow', 'lakeshore'], wing: '#b57c55', detail: '#39333b' },
  { id: 'peacock', name: 'European Peacock', scientificName: 'Aglais io', region: 'Europe and temperate Asia', rarity: 'Uncommon', habitats: ['lantern-grove'], wing: '#ac5539', detail: '#4b416e' },
  { id: 'zebra-longwing', name: 'Zebra Longwing', scientificName: 'Heliconius charithonia', region: 'Central America and the Caribbean', rarity: 'Uncommon', habitats: ['lantern-grove'], wing: '#262832', detail: '#f0e2bd' },
  { id: 'orange-tip', name: 'Orange-tip', scientificName: 'Anthocharis cardamines', region: 'Europe and temperate Asia', rarity: 'Uncommon', habitats: ['meadow'], wing: '#f1ead4', detail: '#e38a4f' },
  { id: 'lime-swallowtail', name: 'Lime Swallowtail', scientificName: 'Papilio demoleus', region: 'South and Southeast Asia', rarity: 'Uncommon', habitats: ['meadow', 'lantern-grove'], wing: '#d8d378', detail: '#364139' },
  { id: 'common-jezebel', name: 'Common Jezebel', scientificName: 'Delias eucharis', region: 'South Asia', rarity: 'Uncommon', habitats: ['lantern-grove'], wing: '#f3e8c9', detail: '#d97d55' },
  { id: 'mourning-cloak', name: 'Mourning Cloak', scientificName: 'Nymphalis antiopa', region: 'Northern Europe, Asia, and North America', rarity: 'Rare', habitats: ['lakeshore', 'lantern-grove'], wing: '#383449', detail: '#e8ca76' },
  { id: 'apollo', name: 'Apollo', scientificName: 'Parnassius apollo', region: 'Mountain regions of Europe and Asia', rarity: 'Rare', habitats: ['lakeshore'], wing: '#f0e8d2', detail: '#cf6e61' },
  { id: 'purple-emperor', name: 'Purple Emperor', scientificName: 'Apatura iris', region: 'Europe and temperate Asia', rarity: 'Rare', habitats: ['lantern-grove'], wing: '#514d7b', detail: '#d8c897' },
  { id: 'dead-leaf', name: 'Orange Oakleaf', scientificName: 'Kallima inachus', region: 'South and Southeast Asia', rarity: 'Rare', habitats: ['lantern-grove'], wing: '#b37748', detail: '#514535' },
  { id: 'two-tailed-pasha', name: 'Two-tailed Pasha', scientificName: 'Charaxes jasius', region: 'Mediterranean basin and North Africa', rarity: 'Rare', habitats: ['lantern-grove'], wing: '#704a43', detail: '#e2a04f' },
  { id: 'great-mormon', name: 'Great Mormon', scientificName: 'Papilio memnon', region: 'South and Southeast Asia', rarity: 'Rare', habitats: ['lantern-grove'], wing: '#292b38', detail: '#b5a9cb' },
  { id: 'emerald-swallowtail', name: 'Emerald Swallowtail', scientificName: 'Papilio palinurus', region: 'Southeast Asia', rarity: 'Epic', habitats: ['lantern-grove'], wing: '#347c67', detail: '#d9c763' },
  { id: 'cairns-birdwing', name: 'Cairns Birdwing', scientificName: 'Ornithoptera euphorion', region: 'Northeastern Australia', rarity: 'Epic', habitats: ['lakeshore', 'lantern-grove'], wing: '#347a57', detail: '#e2c54f' },
  { id: 'malabar-banded-peacock', name: 'Malabar Banded Peacock', scientificName: 'Papilio buddha', region: 'Western Ghats of India', rarity: 'Epic', habitats: ['lantern-grove'], wing: '#287f70', detail: '#9ac86b' },
  { id: 'glasswing', name: 'Glasswing', scientificName: 'Greta oto', region: 'Central America', rarity: 'Epic', habitats: ['lantern-grove'], wing: '#9dc8b6', detail: '#697d75' },
  { id: 'ulysses', name: 'Ulysses Swallowtail', scientificName: 'Papilio ulysses', region: 'Australia and nearby Pacific islands', rarity: 'Epic', habitats: ['lakeshore', 'lantern-grove'], wing: '#2380bc', detail: '#282e47' },
  { id: 'blue-morpho', name: 'Blue Morpho', scientificName: 'Morpho menelaus', region: 'Tropical South America', rarity: 'Legendary', habitats: ['lakeshore'], wing: '#328bd0', detail: '#244161' },
  { id: 'queen-alexandras-birdwing', name: "Queen Alexandra's Birdwing", scientificName: 'Ornithoptera alexandrae', region: 'Lowland forests of Papua New Guinea', rarity: 'Legendary', habitats: ['lantern-grove'], wing: '#267857', detail: '#d8bd4f' },
] as const satisfies readonly ButterflySpecies[]

export type FireflySpecies = {
  id: string
  name: string
  scientificName: string
  region: string
  rarity: GardenRarity
  habitats: readonly GardenHabitatId[]
  color: string
}

export const fireflySpecies = [
  { id: 'glow-worm', name: 'Glow-worm', scientificName: 'Lampyris noctiluca', region: 'Europe and temperate Asia', rarity: 'Common', habitats: ['meadow', 'lantern-grove'], color: '#f5dc8c' },
  { id: 'blue-ghost', name: 'Blue Ghost Firefly', scientificName: 'Phausis reticulata', region: 'Appalachian region of the United States', rarity: 'Rare', habitats: ['meadow', 'lakeshore', 'lantern-grove'], color: '#b8e4de' },
  { id: 'synchronous-firefly', name: 'Synchronous Firefly', scientificName: 'Photinus carolinus', region: 'Eastern Tennessee, United States', rarity: 'Epic', habitats: ['meadow', 'lakeshore', 'lantern-grove'], color: '#e8d899' },
] as const satisfies readonly FireflySpecies[]

export const gardenReflections = [
  'You do not have to earn rest; being human is enough.',
  'A kinder inner voice can make a hard day easier to carry.',
  'Growth is often quiet while it is happening.',
  'You can be a work in progress and still be worthy of care.',
  'A feeling can be real without being the whole story.',
  'Taking a pause is also a way of moving forward.',
  'You are allowed to change your mind as you learn more about yourself.',
  'Small acts of care count, especially the ones no one else sees.',
  'You do not need to solve everything today.',
  'Gentleness is not the opposite of strength.',
  'Progress can look like trying again, or choosing to rest.',
  'You can notice a thought without letting it define you.',
  'There is room to grow at a pace that feels like your own.',
  'Being imperfect does not make you less deserving of kindness.',
  'Some days, showing up for yourself is enough.',
  'You are more than what you managed to finish today.',
  'A boundary can be a way to care for a relationship and yourself.',
  'You can hold hope and uncertainty at the same time.',
  'It is okay to need support; connection is part of being human.',
  'You deserve the patience you so freely offer others.',
  'A difficult moment is one part of a much larger life.',
  'You can begin again without being unkind to the person you were.',
  'Not every answer has to arrive all at once.',
  'Letting something be simple can be its own kind of relief.',
  'Your worth is not measured by your productivity.',
  'Notice what helps you feel grounded, then give yourself permission to return to it.',
  'You can take one small step without seeing the whole path.',
  'You do not have to compare your pace with anyone else’s.',
  'There is courage in being honest about what you need.',
  'A moment of calm is valuable, even when it does not last forever.',
  'You are allowed to make space for joy without explaining it.',
  'Treat yourself like someone you are learning to understand.',
  'A pause can help you choose what matters next.',
  'You can be proud of effort, even before the outcome is clear.',
  'Rest, connection, and play are part of a full life.',
  'You are worthy of care on ordinary days, too.',
] as const
