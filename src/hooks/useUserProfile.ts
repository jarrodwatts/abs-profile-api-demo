import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export interface UserProfile {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
  avatar: {
    assetType: string;
    tier: number;
    key: number;
    season: number;
  };
  banner: {
    assetType: string;
    tier: number;
    key: number;
    season: number;
  };
  tier: number;
  hasCompletedWelcomeTour: boolean;
  hasStreamingAccess: boolean;
  overrideProfilePictureUrl?: string;
  lastTierSeen: number;
  metadata: {
    lastTierSeen: number;
    lastUpgradeSeen: number;
    hasCompletedWelcomeTour: boolean;
  };
  badges: Array<{
    badge: {
      id: number;
      type: string;
      name: string;
      icon: string;
      description: string;
      requirement: string;
      url?: string;
      timeStart?: number;
      timeEnd?: number;
    };
    claimed: boolean;
  }>;
  verification?: string;
}

export interface UserProfileResponse {
  user: UserProfile;
}

const fetchUserProfile = async (
  walletAddress: string
): Promise<UserProfileResponse> => {
  const response = await fetch(`/api/user/address/${walletAddress}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
};

export const useUserProfile = () => {
  const { address, isConnected } = useAccount();

  return useQuery({
    queryKey: ["userProfile", address],
    queryFn: () => fetchUserProfile(address!),
    enabled: isConnected && !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
