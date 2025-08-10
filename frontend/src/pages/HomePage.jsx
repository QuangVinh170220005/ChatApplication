import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelFriendRequest,
  getOutgoingFriendReq,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {MapPinIcon, UserPlusIcon, UsersIcon, XIcon } from "lucide-react";

import { capitalize } from "../lib/until.js";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });


  const { data: outgoingFriendReq = [] } = useQuery({
    queryKey: ["outgoingFriendReq"],
    queryFn: getOutgoingFriendReq,
  });

  
  const getRequestIdByUserId = (userId) => {
    const request = outgoingFriendReq?.find(req => req.recipient._id === userId);
    return request?._id;
  };

  
  const { mutate: sendRequestMutation, isPending: isSending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReq"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error sending friend request:", error);
    }
  });

  const { mutate: cancelRequestMutation, isPending: isCancelling } = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReq"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error cancelling friend request:", error);
      alert("Không thể hủy lời mời kết bạn!");
    }
  });

  const isPendingRequest = (userId) => {
    return outgoingFriendReq?.some(req => req.recipient._id === userId);
  };

  if (loadingFriends || loadingUsers) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Friends Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon className="size-6 text-emerald-600" />
          <h2 className="text-xl font-semibold">My Friends</h2>
        </div>

        {friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>

      {/* Recommended Users Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserPlusIcon className="size-6 text-blue-600" />
          <h2 className="text-xl font-semibold">People You May Know</h2>
        </div>

        {recommendedUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base-content/60">No recommendations available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedUsers.map((user) => (
              <div key={user._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${user._id}`}>
                      <div className="avatar cursor-pointer">
                        <div className="w-12 h-12 rounded-full">
                          <img
                            src={user.profilePic || "/avatar.png"}
                            alt={user.fullName}
                          />
                        </div>
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link to={`/profile/${user._id}`}>
                        <h3 className="font-semibold hover:text-primary cursor-pointer">
                          {user.fullName}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 text-sm text-base-content/70">
                        <MapPinIcon className="size-3" />
                        <span>{user.location || "Unknown"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Native:</span>
                      <span className="text-lg">{getLanguageFlag(user.nativeLanguage)}</span>
                      <span className="text-sm font-medium">
                        {capitalize(user.nativeLanguage)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Learning:</span>
                      <span className="text-lg">{getLanguageFlag(user.learningLanguage)}</span>
                      <span className="text-sm font-medium">
                        {capitalize(user.learningLanguage)}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    {isPendingRequest(user._id) ? (
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => {
                          const requestId = getRequestIdByUserId(user._id);
                          if (!requestId) {
                            alert("Không tìm thấy requestId để hủy!");
                            return;
                          }
                          cancelRequestMutation(requestId);
                        }}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <>
                            <XIcon className="size-4 mr-1" />
                            Cancel Request
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={isSending}
                      >
                        {isSending ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-1" />
                            Add Friend
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
