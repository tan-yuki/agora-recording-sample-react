import React from "react";
import { useMicrophoneAndCameraTracks } from "../hooks/useMicrophoneAndCameraTracks";
import { IAgoraRTCRemoteUser, ClientRole } from "agora-rtc-sdk-ng";
import { MyMediaPlayer } from "./MediaPlayer/MyMediaPlayer";
import { RemoteMediaPlayer } from "./MediaPlayer/RemoteMediaPlayer";

interface LiveScreenProps {
  clientRole: ClientRole;
  remoteUsers: IAgoraRTCRemoteUser[];
}

export function LiveScreen(props: LiveScreenProps) {
  const { clientRole, remoteUsers } = props;
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();

  if (!localAudioTrack || !localVideoTrack) {
    return null;
  }

  const remoteMediaPlayers = remoteUsers
    .filter((user: IAgoraRTCRemoteUser) => {
      return user.audioTrack || user.videoTrack;
    })
    .map((user: IAgoraRTCRemoteUser) => {
      return (
        <RemoteMediaPlayer
          key={`remote-${user.uid.toString()}`}
          audioTrack={user.audioTrack}
          videoTrack={user.videoTrack}
        />
      );
    });

  return (
    <div>
      <MyMediaPlayer
        clientRole={clientRole}
        audioTrack={localAudioTrack}
        videoTrack={localVideoTrack}
      />
      {remoteMediaPlayers}
    </div>
  );
}
