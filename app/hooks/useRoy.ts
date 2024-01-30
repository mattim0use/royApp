import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useGlobalState } from "@/app/store/store";
import toast from "react-hot-toast";




let roy = {} as Roy;

// attest sending roy
// create story
// embed results
// upload to db
const createPostCard = async (res: any) => {
    console.log("load", res);

    const response = await fetch("/api/newShip",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ res }),
        });
    const r = await response.json();

    console.log("rawResponse", r);

    return { r }

}




interface DecadeResolution {
    uri: string;
    year: number;
    resolution: string;
}

// Interface defining the LifeEvent type
interface LifeEvent {
    type: string; // More specific enum or type can be used
    description: string;
    timestamp: Date;
}


export interface RoyAttributes {
    name: string;
    currentLocation: string;
    currentYear: number;
    bornIn: { place: string, yearOfBirth: number; }
    experiences: LifeEvent[];
    lifeHistory: string[];
    count: number;
    image: string;
    // ... any additional attributes
}

const createRoy = async (id: string, roy: RoyAttributes, address: string) => {
    //Attest new Roy 
    // Generate Starting Decade
    const load = { id, roy, address }
    const response = await fetch("/api/newRoy",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(load),
        });
    const r = await response.json();

    console.log("rawResponse", r);
    const parsed: RoyAttributes = JSON.parse(r)
    toast.success(`"${parsed.name} has been created"`)

    // image that comes up to your mind
    const postCard = await createPostCard(parsed.lifeHistory);

    return { parsed, postCard }
}

const newDecade = async (roy: RoyAttributes, decade: DecadeResolution) => {
    //Attest new Roy 
    // Generate Starting Decade
    //
    const query = { roy, decade }
    const response = await fetch("/api/newDecade",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query }),
        });
    const r = await response.json();

    console.log("rawResponse", r);
    const parsed: Roy = JSON.parse(r)

    // image that comes up to your mind
    const postCard = await createPostCard(r);

    return { parsed, postCard }

}

// The Roy class
export class Roy {
    _id: string;
    address: string;
    attributes: RoyAttributes;
    currentDecadeResolution: DecadeResolution | null;
    // The constructor initiates a Roy with default or provided attributes
    constructor(
        uid: string,
        address: string,
        attributes?: Partial<RoyAttributes>,
        location?: string,
        year?: number,
        name?: string,
    ) {
        // Creates a unique identifier for each Roy instance
        this._id = uid
        this.address = address
        // Default Roy's attributes
        const defaultAttributes: RoyAttributes = {
            name: name || "Roy",
            currentLocation: location || "Earth",
            currentYear: year || 1999 + 10,
            bornIn: { place: location || "Denver", yearOfBirth: year || 1999 },
            experiences: [],
            lifeHistory: [],
            count: 0,
            image: ""
        };

        // Assign attributes with provided values taking precedence over defaults
        this.attributes = { ...defaultAttributes, ...attributes };
        this.currentDecadeResolution = null;
    }

    // Getter method for Roy's ID
    // 
    getId(address?: string, uid?: string): string | null {
        return this._id;
    }
    async simulateOrigin(): Promise<void> {
        // The simulation logic tailored to the game's rules would go here
        // Update Roy's attributes, experiences, finances, etc.
        // For example, let's simulate an addition to experiences based on the resolution:
        if (this._id) {
            const response = await createRoy(this._id, this.attributes, this.address);
            this.attributes = response.parsed
            this.attributes.image = response.postCard.r.image
            console.log("roy", this.attributes, response);

        }

    }


    // Simulate life outcome based on DecadeResolution
    async simulateDecade(): Promise<void> {
        // The simulation logic tailored to the game's rules would go here
        // Update Roy's attributes, experiences, finances, etc.

        // For example, let's simulate an addition to experiences based on the resolution:
        if (this.currentDecadeResolution) {
            const response = await newDecade(this.attributes, this.currentDecadeResolution);



            // Reset the currentDecadeResolution after processing it
            this.currentDecadeResolution = null;
        }
    }

    // Set a new decade's resolution for Roy
    setDecadeResolution(resolution: DecadeResolution): void {
        this.currentDecadeResolution = resolution;
    }

    // Adds a life event to Roy's life history
    addLifeEvent(event: LifeEvent): void {
        this.attributes.experiences.push(event);
    }

    // Method to retrieve current state of Roy, suitable for serialization
    getCurrentState(): RoyAttributes {
        return this.attributes;
    }
}

export const useRoy = async (uid: string, address: string, resolution: string, roy: RoyAttributes) => {
    // Presumed usage
    const royInstance = new Roy(uid, address, roy)// Create a new Roy instance
    royInstance.setDecadeResolution({ uri: uid, year: (roy.currentYear + 10), resolution: resolution }); // Set a new decade's resolution
    // Simulate setting a new decade's resolution and processing it
    royInstance.simulateDecade();
    // Retrieve Roy's current state
    const royState = royInstance.getCurrentState();
    console.log(royState);

};


export const newRoy = async (uid: string, address: string, name: string, location: string, year: number) => {
    // Presumed usage
    const attributes = {
    } as RoyAttributes
    const royInstance = new Roy(uid, address, attributes, location, year, name); // Create a new Roy instance
    // Simulate setting a new decade's resolution and processing it
    await royInstance.simulateOrigin();
    // Retrieve Roy's current state
    console.log(royInstance);
    return royInstance;

};

export const loadRoy = (uid: string, address: string, attributes: RoyAttributes) => {
    const myRoy = new Roy(uid, address, attributes); // Create a new Roy instance
    return myRoy
}

