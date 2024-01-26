import scaffoldConfig from "@/app/scaffold.config";
import { contracts } from "@/app/utils/scaffold-eth/contract";

export function getAllContracts() {
    const contractsData = contracts?.[scaffoldConfig.targetNetworks[0].id];
    return contractsData ? contractsData : {};
}
