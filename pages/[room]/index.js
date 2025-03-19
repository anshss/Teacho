import { useState, useEffect } from "react";
import { HuddleClient } from "@huddle01/react";
import { useRoom } from "@huddle01/react/hooks";
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
  const { peerIds } = usePeerIds({ roles: [Role.HOST, Role.CO_HOST] });

  return (
    <div>
      {peerIds.map((peerId) => (
        <RemotePeer key={peerId} peerId={peerId} />
      ))}
    </div>
  );
};

// ✅ Correctly Initialize Huddle Client
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
  const [roomId, setRoomId] = useState(null);
  const { joinRoom, leaveRoom } = useRoom({
    onJoin: () => console.log("Joined the room"),
    onLeave: () => console.log("Left the room"),
  });

  // ✅ Step 1: Create Room & Get Room ID
  useEffect(() => {
    async function createRoom() {
      try {
        const response = await fetch("/api/create-room", { method: "POST" });
        const resJson = await response.json();

        if (!resJson.roomId) {
          console.error("Error: Room ID not generated");
          return;
        }

        setRoomId(resJson.roomId); // ✅ Now correctly setting roomId
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }

    createRoom();
  }, []);

  // ✅ Step 2: Get Token & Join Room (AFTER `roomId` is set)
  useEffect(() => {
    if (!roomId) return; // Ensure roomId is available before calling API

    async function getTokenAndJoin() {
      try {
        const response = await fetch(`/api/getAccessToken?roomId=${roomId}`);
        const resJson = await response.json();

        if (!resJson.token) {
          console.error("Error: Failed to get token");
          return;
        }

        await joinRoom({ roomId, token: resJson.token });
        setJoined(true);
      } catch (error) {
        console.error("Error joining room:", error);
      }
    }

    getTokenAndJoin();

    return () => {
      if (joined) leaveRoom();
    };
  }, [roomId]); // ✅ Runs only when `roomId` is available

  if (!joined) {
    return <div>Loading...</div>;
  }

  return <MeetScreen />;
}

const MeetScreen = () => {
  const { enableVideo, disableVideo, isVideoOn } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } = useLocalScreenShare();

  return (
    <div className="bg-primary w-full p-4">
      {/* Webcam Toggle */}
      <button
        onClick={() => (isVideoOn ? disableVideo() : enableVideo())}
        className="m-2 p-2 bg-blue-500 text-white rounded"
      >
        {isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>

      {/* Mic Toggle */}
      <button
        onClick={() => (isAudioOn ? disableAudio() : enableAudio())}
        className="m-2 p-2 bg-green-500 text-white rounded"
      >
        {isAudioOn ? "Mute Mic" : "Unmute Mic"}
      </button>

      {/* Screen Share Toggle */}
      <button
        onClick={() => (shareStream ? stopScreenShare() : startScreenShare())}
        className="m-2 p-2 bg-purple-500 text-white rounded"
      >
        {shareStream ? "Stop Sharing Screen" : "Start Screen Share"}
      </button>

      <ShowPeers />
    </div>
  );
};
