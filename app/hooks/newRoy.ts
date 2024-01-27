import type { Roy } from "@/app/types/appTypes"
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useSigner } from "../utils/wagmi-utils";
import { useAccount } from "wagmi";



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

export const createRoy = async (roy: Roy) => {
    //Attest new Roy 
    // Generate Starting Decade
    const response = await fetch("/api/newResolution",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(roy),
        });
    const r = await response.json();

    console.log("rawResponse", r);
    const parsed: Roy = JSON.parse(r)

    // image that comes up to your mind
    const postCard = await createPostCard(r);
    roy.imageUrl = postCard.parsed.image;

    return { parsed, roy }

}
