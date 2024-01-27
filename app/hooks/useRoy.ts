import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";





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
    const parsed = JSON.parse(r)

    return { parsed }

}

const createRoy = async (id: string, roy: RoyAttributes, name: string) => {
    //Attest new Roy 
    // Generate Starting Decade
    const query = { id, roy, name }
    const response = await fetch("/api/newRoy",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(query),
        });
    const r = await response.json();

    console.log("rawResponse", r);
    const parsed: RoyAttributes = JSON.parse(r)

    // image that comes up to your mind
    const postCard = await createPostCard(r);

    return { parsed, roy }

}
interface DecadeResolution {
    year: number;
    resolution: string;
}

// Interface defining the LifeEvent type
interface LifeEvent {
    type: string; // More specific enum or type can be used
    description: string;
    timestamp: Date;
}


interface RoyAttributes {
    uid: string;
    name: string;
    bornIn: { place: string, dateOfBirth: Date; }
    finances: number;
    experiences: LifeEvent[];
    lifeHistory: string[];
    physicalAbility: string;
    emotionalState: string;
    spiritualBeliefs: string | null;
    count: number;
    // ... any additional attributes
}

const attestRoy = async (
    name: string,
    signer: any,
    address: string
) => {

    const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
    const schemaUID = "0x2e9af8cbe5bcedbde5ecc9374d6525f893c98db76a932916550b6d272404c6d5";
    const eas = new EAS(easContractAddress);
    // Signer must be an ethers-like signer.

    if (!signer) return;
    await eas.connect(signer);
    // Initialize SchemaEncoder with the schema string
    const offchain = await eas.getOffchain();
    const schemaEncoder = new SchemaEncoder("string royName");
    const encodedData = schemaEncoder.encodeData([
        { name: "royName", value: name, type: "string" }
    ]);
    const offchainAttestation = await offchain.signOffchainAttestation(
        {
            version: 1,
            recipient: address,
            expirationTime: BigInt(0),
            time: BigInt(0),
            revocable: true,
            refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
            // Be aware that if your schema is not revocable, this MUST be false
            schema: schemaUID,
            data: encodedData,
        },
        signer,
    )

    const updatedData = JSON.stringify(
        offchainAttestation,
        (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
    );

    let uid = offchainAttestation.uid;
    console.log("New attestation UID:", updatedData);
}

export const advanceRoy = async (
    resolution: string,
    address: string,
    offchain: any,
    signer: any,

) => {

    const easContractAddress = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
    const schemaUID = "0x64f9c0f771b33583107be7ef7532e23ef8e0154919e40a1f14a67ca519a92a0e";
    // Signer must be an ethers-like signer.
    // Initialize SchemaEncoder with the schema string

    const schemaEncoder = new SchemaEncoder("string royResolution");
    const encodedData = schemaEncoder.encodeData([
        { name: "royResolution", value: resolution, type: "string" }
    ]);
    const offchainAttestation = await offchain.signOffchainAttestation(
        {
            version: 1,
            recipient: address,
            expirationTime: BigInt(0),
            time: BigInt(0),
            revocable: true,
            refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
            // Be aware that if your schema is not revocable, this MUST be false
            schema: schemaUID,
            data: encodedData,
        },
        signer,
    )

    const updatedData = JSON.stringify(
        offchainAttestation,
        (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
    );

    let uid = offchainAttestation.uid;
    console.log("New attestation UID:", uid);
    return uid;
}


const newDecade = async (uid: string, roy: RoyAttributes, decade: DecadeResolution) => {
    //Attest new Roy 
    // Generate Starting Decade
    //
    const query = { uid, roy, decade }
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

    return { parsed, roy }

}

// The Roy class
class Roy {
    _id: string;
    attributes: RoyAttributes;
    currentDecadeResolution: DecadeResolution | null;

    // The constructor initiates a Roy with default or provided attributes
    constructor(uid: string, location: string, year: number, name: string, attributes?: Partial<RoyAttributes>) {
        // Creates a unique identifier for each Roy instance
        this._id = uid
        // Default Roy's attributes
        const defaultAttributes: RoyAttributes = {
            uid: uid,
            name: name,
            bornIn: { place: location, dateOfBirth: new Date(year) },
            finances: 0,
            experiences: [],
            lifeHistory: [],
            physicalAbility: 'Healthy',
            emotionalState: 'Neutral',
            spiritualBeliefs: null,
            count: 0,
        };

        // Assign attributes with provided values taking precedence over defaults
        this.attributes = { ...defaultAttributes, ...attributes };
        this.currentDecadeResolution = null;
    }

    // Getter method for Roy's ID
    // 
    getId(): string | null {
        return this._id;
    }
    async simulateOrigin(): Promise<void> {
        // The simulation logic tailored to the game's rules would go here
        // Update Roy's attributes, experiences, finances, etc.

        // For example, let's simulate an addition to experiences based on the resolution:
        if (this.currentDecadeResolution) {
            const response = await createRoy(this._id, this.attributes, this.currentDecadeResolution.resolution);

            response.roy.experiences.forEach((e: LifeEvent) => {

                this.attributes.experiences.push(e);
            });

            // Reset the currentDecadeResolution after processing it
            this.currentDecadeResolution = null;
        }
    }


    // Simulate life outcome based on DecadeResolution
    async simulateDecade(): Promise<void> {
        // The simulation logic tailored to the game's rules would go here
        // Update Roy's attributes, experiences, finances, etc.

        // For example, let's simulate an addition to experiences based on the resolution:
        if (this.currentDecadeResolution) {
            const response = await newDecade(this._id, this.attributes, this.currentDecadeResolution);

            response.roy.experiences.forEach((e: LifeEvent) => {

                this.attributes.experiences.push(e);
            });

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

export const useRoy = async (resolution: string, location: string, year: number, name: string, signer: any, address: any, offchain: any) => {
    // Presumed usage
    const uri = await advanceRoy(resolution, signer, address as `0x${string}`, offchain)
    if (!uri) return;
    const royInstance = new Roy(uri, location, year, name); // Create a new Roy instance

    // Simulate setting a new decade's resolution and processing it
    royInstance.setDecadeResolution({ year: 2020, resolution });
    royInstance.simulateDecade();
    // Retrieve Roy's current state
    const royState = royInstance.getCurrentState();
    console.log(royState);

};


export const newRoy = async (name: string, location: string, year: number, signer: any, address: any) => {
    // Presumed usage
    const uri = await advanceRoy(name, signer, address as `0x${string}`)
    if (!uri) return;
    const royInstance = new Roy(uri, location, year, name); // Create a new Roy instance
    // Simulate setting a new decade's resolution and processing it
    royInstance.simulateDecade();
    // Retrieve Roy's current state
    const royState = royInstance.getCurrentState();
    console.log(royState);

};

