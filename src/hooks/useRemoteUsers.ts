import { IAgoraRTCRemoteUser, IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

function mergeUser(
  users: IAgoraRTCRemoteUser[],
  user: IAgoraRTCRemoteUser
): IAgoraRTCRemoteUser[] {
  // Create map for key: uid, value: user to omit same uid user.
  const map = [...users, user].reduce((acc, current) => {
    return { ...acc, [current.uid]: current };
  }, {});

  return Object.values(map);
}

function removeUser(
  users: IAgoraRTCRemoteUser[],
  targetUser: IAgoraRTCRemoteUser
): IAgoraRTCRemoteUser[] {
  return users.filter((user) => user.uid !== targetUser.uid);
}

export function useRemoteUsers(
  client: IAgoraRTCClient
): [IAgoraRTCRemoteUser[], Dispatch<SetStateAction<IAgoraRTCRemoteUser[]>>] {
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  useEffect(() => {
    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: "audio" | "video"
    ) => {
      await client.subscribe(user, mediaType);
      setRemoteUsers((users) => mergeUser(users, user));
    };
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((users) => removeUser(users, user));
    };
    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((users) => mergeUser(users, user));
    };
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((users) => removeUser(users, user));
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
    };
  }, [client]);

  return [remoteUsers, setRemoteUsers];
}

export const UNCAPSULE_FOR_TEST = { mergeUser, removeUser };
