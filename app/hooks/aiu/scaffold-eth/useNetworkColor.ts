import { useDarkMode } from "./useDarkMode";
import { useTargetNetwork } from "./useTargetNetwork";
import { ChainWithAttributes } from "@/app/utils/scaffold-eth";

export const DEFAULT_NETWORK_COLOR: [string, string] = ["#666666", "#bbbbbb"];

export function getNetworkColor(
  network: ChainWithAttributes,
  isDarkMode: boolean,
) {
  const colorConfig = DEFAULT_NETWORK_COLOR;
  return Array.isArray(colorConfig)
    ? isDarkMode
      ? colorConfig[1]
      : colorConfig[0]
    : colorConfig;
}

/**
 * Gets the color of the target network
 */
export const useNetworkColor = () => {
  const { isDarkMode } = useDarkMode();
  const { targetNetwork } = useTargetNetwork();

  return getNetworkColor(targetNetwork, isDarkMode);
};
