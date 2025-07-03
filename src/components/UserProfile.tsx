"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useAccount } from "wagmi";
import Image from "next/image";

export default function UserProfile() {
  const { isConnected } = useAccount();
  const { data, isLoading, error } = useUserProfile();

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-gray-400">
          Please connect your wallet to view profile
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900 rounded-lg">
        <p className="text-red-400">Error loading profile: {error.message}</p>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No profile data found</p>
      </div>
    );
  }

  const { user } = data;
  const claimedBadges = user.badges.filter((b) => b.claimed);
  const flashBadges = claimedBadges.filter((b) => b.badge.type === "flash");
  const regularBadges = claimedBadges.filter((b) => b.badge.type === "regular");
  const secretBadges = claimedBadges.filter((b) => b.badge.type === "secret");

  const getTierName = (tier: number) => {
    switch (tier) {
      case 1:
        return "Bronze";
      case 2:
        return "Silver";
      case 3:
        return "Gold";
      case 4:
        return "Platinum";
      default:
        return `Tier ${tier}`;
    }
  };

  const getTierColors = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-amber-700 text-amber-100"; // Bronze
      case 2:
        return "bg-gray-500 text-gray-100"; // Silver
      case 3:
        return "bg-yellow-600 text-yellow-100"; // Gold
      case 4:
        return "bg-purple-600 text-purple-100"; // Platinum
      default:
        return "bg-blue-600 text-blue-100";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative">
          <Image
            src={user.overrideProfilePictureUrl || "/default-avatar.png"}
            alt={`${user.name}'s avatar`}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
          />
          <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {user.tier}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{user.name}</h1>
          <p className="text-gray-300 mt-2">{user.description}</p>
          <div className="flex items-center mt-3 space-x-4">
            <span
              className={`px-3 py-1 ${getTierColors(
                user.tier
              )} rounded-full text-sm font-medium`}
            >
              {getTierName(user.tier)}
            </span>
            {user.verification && (
              <span className="px-3 py-1 bg-green-600 text-green-100 rounded-full text-sm font-medium">
                {user.verification.replace("_", " ")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-white">
            {claimedBadges.length}
          </div>
          <div className="text-sm text-gray-400">Total Badges</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-white">
            {regularBadges.length}
          </div>
          <div className="text-sm text-gray-400">Regular Badges</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-white">
            {flashBadges.length}
          </div>
          <div className="text-sm text-gray-400">Flash Badges</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-white">
            {secretBadges.length}
          </div>
          <div className="text-sm text-gray-400">Secret Badges</div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Account Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Welcome Tour:</span>
              <span
                className={
                  user.hasCompletedWelcomeTour
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {user.hasCompletedWelcomeTour ? "Completed" : "Not Completed"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Streaming Access:</span>
              <span
                className={
                  user.hasStreamingAccess ? "text-green-400" : "text-red-400"
                }
              >
                {user.hasStreamingAccess ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-white mb-2">Wallet Address</h3>
          <p className="text-gray-400 font-mono text-sm break-all">
            {user.walletAddress}
          </p>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {claimedBadges.map((badge) => (
            <div
              key={badge.badge.id}
              className={`p-3 rounded-lg ${
                badge.badge.type === "flash"
                  ? "bg-orange-900"
                  : badge.badge.type === "secret"
                  ? "bg-purple-900"
                  : "bg-gray-700"
              }`}
            >
              <h4 className="font-medium text-white text-sm">
                {badge.badge.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
