import { create } from "zustand";
import scaffoldConfig from "@/app/scaffold.config";
import { ChainWithAttributes } from "@/app/utils/scaffold-eth";
import { Roy, RoyAttributes } from "@/app/hooks/useRoy";

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
    roy: any
    setRoy: (newRoy: any) => void;
    roys: [{ roy: [{ roy: RoyAttributes, uid: string }], _id: { address: string, uid: string } }];
    setRoys: (newRoys: [{ roy: [{ roy: RoyAttributes, uid: string }], _id: { address: string, uid: string } }]) => void;
    setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
    targetNetwork: ChainWithAttributes;
    setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
    nativeCurrencyPrice: 0,
    setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
    roy: {} as Roy,
    setRoy: (newRoy: Roy) => set(() => ({ roy: newRoy })),
    roys: [{}] as [{ roy: [{ roy: RoyAttributes, uid: string }], _id: { address: string, uid: string } }],
    setRoys: (newRoys: [{ roy: [{ roy: RoyAttributes, uid: string }], _id: { address: string, uid: string } }]) => set(() => ({ roys: newRoys })),
    targetNetwork: scaffoldConfig.targetNetworks[0],
    setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
}));
