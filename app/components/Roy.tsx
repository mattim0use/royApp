import { useGlobalState } from '@/app/store/store';
import { BotScreen } from './AppComponent';
import { useState } from 'react';


const RoyInterface = () => {

    const roy = useGlobalState(state => state.roy)
    const [index, setIndex] = useState(0)
    const RoyExperiences = () => {
        if (!roy.attributes) return
        const updateIndex = () => {
            setIndex(index + 1)
            if (index + 1 > roy.attributes.experiences.length - 1) setIndex(0)
        }
        return (
            <div onClick={() => updateIndex()} className="flex flex-row cursor-pointer border-2 h-[100px] overflow-auto">
                <li><strong>Life Event: <br />{roy.attributes.experiences[index].type}</strong> : {roy.attributes.experiences[index].description}</li>
            </div>)
    }


    return (
        <>

            <div className="p-2 border-2 h-[1000px]">
                <div className="flex flex-col w-full h-full overflow-auto">
                    <BotScreen />

                    {roy.attributes && (
                        <>
                            <ul className="p-2 m-2 w-full">
                                <li><strong>Name:</strong> {roy.attributes.name}</li>
                                <li><strong>Current Location: </strong> {roy.attributes.currentLocation}</li>
                                <li><strong>Current Year:</strong>  {roy.attributes.currentYear}</li>
                                <li><strong>Current Decade:</strong>  {roy.attributes.count}</li>
                                <li><strong>Resolution:</strong>  {roy.currentDecadeResolution}</li>

                                <RoyExperiences />
                            </ul>
                        </>
                    )
                    }
                </div>

            </div>
        </>
    )
}

export default RoyInterface
