import AudioController from "../components/aiu/AudioController";
// appTypes 
//

export type Sounds = {
    spaceshipHum?: AudioBuffer | null;
    spaceshipOn?: AudioBuffer | null;
    holographicDisplay?: AudioBuffer | null;
    warpSpeed?: AudioBuffer | null;
    audioController: AudioController | null;
};

