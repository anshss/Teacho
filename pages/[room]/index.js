import { HuddleClient, HuddleProvider } from "@huddle01/react";
import { useRoom } from "@huddle01/react/hooks";
import { useState, useEffect } from "react";
import {
  useLocalVideo,
  useLocalAudio,
  useLocalScreenShare,
} from "@huddle01/react/hooks";

import {
  usePeerIds,
  useRemoteVideo,
  useRemoteAudio,
} from "@huddle01/react/hooks";
import { Audio, Video } from "@huddle01/react/components";
import { Role } from "@huddle01/server-sdk/auth";
import { VideoCall } from "@/components/VideoCall";

const RemotePeer = ({ peerId }) => {
  const { stream: videoStream } = useRemoteVideo({ peerId });
  const { stream: audioStream } = useRemoteAudio({ peerId });

  return (
    <div>
      {videoStream && <Video stream={videoStream} />}
      {audioStream && <Audio stream={audioStream} />}
    </div>
  );
};

const ShowPeers = () => {
  const { peerIds } = usePeerIds({ roles: [Role.HOST, Role.CO_HOST] }); // Get Hosts And Cohost's peerIds

  return (
    <div>
      {peerIds.map((peerId) => {
        return <RemotePeer key={peerId} peerId={peerId} />;
      })}
    </div>
  );
};

const roomId = "pjj-tkkb-ern";
const huddleClient = new HuddleClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  options: {
    activeSpeakers: {
      size: 12,
    },
  },
});

export default function Classes() {
  const [joined, setJoined] = useState(false);
  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => {
      console.log("Joined the room");
    },
    onLeave: () => {
      console.log("Left the room");
    },
  });

  useEffect(() => {
    async function getToken(roomId) {
      const response = await fetch(
        `http://localhost:3000/api/getAccessToken?roomId=${roomId}`,
      );
      const resJson = await response.json();
      const token = resJson.token;
      return token;
    }

    async function join() {
      const token = await getToken(roomId);
      await joinRoom({
        roomId: roomId,
        token: token,
      });

      setJoined(true);
    }

    join();

    return () => {
      leaveRoom();
    };
  }, []);

  if (!joined) {
    return <div>Loading...</div>;
  }

  return <VideoCall />;

  return <MeetScreen />;
}

const MeetScreen = () => {
  const {
    stream: localudioStream,
    enableVideo,
    disableVideo,
    isVideoOn,
  } = useLocalVideo();
  const {
    stream: localVideoStream,
    enableAudio,
    disableAudio,
    isAudioOn,
  } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();

  return (
    <div className="bg-primary w-full ">
      {/* Webcam */}
      <button
        onClick={() => {
          isVideoOn ? disableVideo() : enableVideo();
        }}
      >
        Fetch and Produce Video Stream
      </button>

      {/* Mic */}
      <button
        onClick={() => {
          isAudioOn ? disableAudio() : enableAudio();
        }}
      >
        Fetch and Produce Audio Stream
      </button>

      {/* Screen Share */}
      <button
        onClick={() => {
          shareStream ? stopScreenShare() : startScreenShare();
        }}
      >
        Fetch and Produce Screen Share Stream
      </button>

      <ShowPeers />
    </div>
  );
};
