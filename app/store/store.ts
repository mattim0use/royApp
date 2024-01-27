import { create } from "zustand";
import scaffoldConfig from "@/app/scaffold.config";
import { ChainWithAttributes } from "@/app/utils/scaffold-eth";
import { Roy } from "@/app/types/appTypes";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
    nativeCurrencyPrice: number;
    roys: Roy[];
    setRoys: (newRoys: Roy[]) => void;
    setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
    targetNetwork: ChainWithAttributes;
    setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
    nativeCurrencyPrice: 0,
    setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
    roys: [],
    setRoys: (newRoys: Roy[]) => set(() => ({ roys: newRoys })),
    targetNetwork: scaffoldConfig.targetNetworks[0],
    setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
}));
