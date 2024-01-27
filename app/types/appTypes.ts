import AudioController from "../components/aiu/AudioController";
// appTypes 
//
// Entities
export type Roy = {
    uid: string;
    count: number;
    name: string;
    age: number;
    finances: Finances;
    experiences: Experience[];
    physicalAbility: PhysicalAbility;
    emotionalState: EmotionalState;
    spiritualBeliefs?: SpiritualBeliefs;
    messages: string[];
    lifeEvents: LifeEvent[];
    imageUrl: string;
}

interface LifeEvent {
    description: string;
    date: Date;
}

// Attributes
type Finances = {
    income: number;
    savings: number;
    debt: number;
}

type Experience = {
    description: string;
    impactOnRoy: number;
}

type PhysicalAbility = {
    healthStatus: string;
    fitnessLevel: number;
}

type EmotionalState = {
    happinessLevel: number;
    stressLevel: number;
}

type SpiritualBeliefs = {
    religion?: string;
    importance: number;
}

// Relationships and Events
type ChoiceConsequence = {
    choiceMade: string;
    outcome: string;
}

type AgeRelatedEvent = {
    age: number;
    likelyEvents: LifeEvent[];
}

type FinancialDecision = {
    decisionType: string;
    outcome: Finances;
}

type HealthLifeSpan = {
    healthChoices: string[];
    expectedLifespan: number;
}

// Processes
class Simulation {
    runSimulation(decadeChoice: DecadeChoice): LifeEvent[] {
        // Method to run the simulation for the decade choice
        return [];
    }
}

class Visualization {
    createVisualization(roy: Roy): string {
        // Method to create a visualization of Roy's life
        return 'visualization_url';
    }
}

class NFTMinting {
    mintNFT(visualization: string): NFT {
        // Minting the NFT with the visualization
        return new NFT(visualization);
    }
}

class NFT {
    constructor(public visualization: string) { }
}

// Constraints (Typically expressed as business logic within methods)
// ...

// Goals
type LifeDiscovery = {
    goalDescription: string;
    pursueDiscovery(roy: Roy): void;
}

type UniqueStorytelling = {
    narrative: string;
    generateStory(roy: Roy): string;
}

// Metrics
type MortalityRates = {
    [age: number]: number; // Percentage chance of death at that age
}

type IncarcerationRates = {
    [choice: string]: number; // Chance of incarceration based on a choice
}

type MarriageSuccess = {
    yearsMarried: number;
    successRate: number;
}

type FinancialOutcomes = {
    careerChoice: string;
    averageEarnings: number;
    bankruptcyRate: number;
}

// Decade Choice
type DecadeChoice = {
    newYearsResolution: string;
}
// Update Roy's life events with the outcomes of the simulation
export type Sounds = {
    spaceshipHum?: AudioBuffer | null;
    spaceshipOn?: AudioBuffer | null;
    holographicDisplay?: AudioBuffer | null;
    warpSpeed?: AudioBuffer | null;
    audioController: AudioController | null;
};

