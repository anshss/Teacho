import {
  Video as VideoIcon,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  Users,
  MessageCircle,
  Settings,
} from "lucide-react";

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

const RemotePeer = ({ peerId }) => {
  const { stream: videoStream } = useRemoteVideo({ peerId });
  const { stream: audioStream } = useRemoteAudio({ peerId });

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-gray-700">
      {audioStream && <Audio stream={audioStream} />}
      <div className="w-full h-full flex items-center justify-center  object-cover">
        {videoStream && <Video stream={videoStream} />}
      </div>
      <div className="absolute bottom-4 left-4 bg-gray-900/60 px-3 py-1 rounded-lg">
        You
      </div>
    </div>
  );
};

export const VideoCall = () => {
  const { peerIds } = usePeerIds({ roles: [Role.HOST, Role.CO_HOST] }); // Get Hosts And Cohost's peerIds
  const { stream: localAudioStream } = useLocalVideo();
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Grid */}
      <div className="h-screen flex flex-col">
        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-gray-700">
            <div className="w-full h-full flex items-center justify-center object-cover">
              {localAudioStream && <Video stream={localAudioStream} />}
            </div>
            <div className="absolute bottom-4 left-4 bg-gray-900/60 px-3 py-1 rounded-lg">
              You
            </div>
          </div>
          {peerIds.map((peerId) => {
            return <RemotePeer peerId={peerId} />;
          })}
        </div>

        <Controls />
      </div>
    </div>
  );
};

function Controls() {
  const {
    stream: localAudioStream,
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

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-6">
      <div className="w-full flex items-center justify-center space-x-4">
        <button
          onClick={() => (isVideoOn ? disableVideo() : enableVideo())}
          className={`p-4 rounded-full ${isVideoOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"} transition-colors`}
        >
          {isVideoOn ? <VideoIcon size={24} /> : <VideoOff size={24} />}
        </button>
        <button
          onClick={() => (isAudioOn ? disableAudio() : enableAudio())}
          className={`p-4 rounded-full ${isAudioOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"} transition-colors`}
        >
          {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
        </button>
        <button className="px-6 py-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center space-x-2">
          <PhoneOff size={24} />
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
