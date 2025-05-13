import { HuddleProvider, HuddleClient } from "@huddle01/react";
import { useRoom } from "@huddle01/react/hooks";
import { useState, useEffect, useRef } from "react";
import {
    useLocalVideo,
    useLocalAudio,
    useLocalScreenShare,
    useLocalPeer,
} from "@huddle01/react/hooks";

import {
    usePeerIds,
    useRemoteVideo,
    useRemoteAudio,
} from "@huddle01/react/hooks";
import { Audio, Video } from "@huddle01/react/components";
import { Role } from "@huddle01/server-sdk/auth";
import { useRouter } from "next/router";

const RemotePeer = ({ peerId }) => {
    const { stream: videoStream } = useRemoteVideo({ peerId });
    const { stream: audioStream } = useRemoteAudio({ peerId });

    return (
        <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-gray-700 m-2">
            {audioStream && <Audio stream={audioStream} />}
            <div className="w-full h-full flex items-center justify-center object-cover">
                {videoStream && <Video stream={videoStream} />}
            </div>
            <div className="absolute bottom-4 left-4 bg-gray-900/60 px-3 py-1 rounded-lg">
                Peer
            </div>
        </div>
    );
};

const ShowPeers = () => {
    const { peerIds } = usePeerIds();

    return (
        <div className="grid grid-cols-2 gap-4">
            {peerIds.map((peerId) => (
                <RemotePeer key={peerId} peerId={peerId} />
            ))}
        </div>
    );
};

export default function Room() {
    const router = useRouter();
    const [joined, setJoined] = useState(false);
    const videoRef = useRef(null);
    const screenRef = useRef(null);

    const { roomId } = router.query;
    const currentRoomId = roomId || "mqf-wujj-kqq"; // Use router roomId or fallback

    const { joinRoom, leaveRoom, state } = useRoom({
        onJoin: () => {
            console.log("Joined room:", currentRoomId);
            setJoined(true);
        },
        onWaiting: (data) => {
            console.log("Waiting for room to start:", data);
        },
        onLeave: () => {
            console.log("Left room");
            setJoined(false);
        },
        onPeerJoin: (peer) => {
            console.log("Peer joined:", peer);
        },
        onPeerLeave: (peer) => {
            console.log("Peer left:", peer);
        },
    });

    const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
    const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
    const { startScreenShare, stopScreenShare, shareStream } = useLocalScreenShare();
    const { updateMetadata } = useLocalPeer();

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        if (shareStream && screenRef.current) {
            screenRef.current.srcObject = shareStream;
        }
    }, [shareStream]);

    async function getToken(roomId) {
        console.log("Getting token for room:", roomId);
        try {
            const response = await fetch(
                `/api/getAccessToken?roomId=${roomId}`
            );
            const resJson = await response.json();
            console.log("Token response:", resJson);
            return resJson.token;
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    }

    async function join() {
        if (!currentRoomId) return;
        
        console.log("Joining room:", currentRoomId);
        try {
            const token = await getToken(currentRoomId);
            if (!token) {
                console.error("Failed to get token");
                return;
            }

            await joinRoom({
                roomId: currentRoomId,
                token: token,
            });
            
            updateMetadata({ displayName: "User" });
        } catch (error) {
            console.error("Error joining room:", error);
        }
    }

    useEffect(() => {
        if (currentRoomId && !joined && state === "idle") {
            join();
        }
    }, [currentRoomId, state]);

    if (state === "idle" && !joined) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Joining Meeting...</h1>
                    <p>Connecting to room: {currentRoomId}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="h-screen flex flex-col">
                <div className="p-4 bg-gray-800 border-b border-gray-700">
                    <h1 className="text-xl font-bold">Room: {currentRoomId}</h1>
                    <p className="text-sm text-gray-400">
                        Status: {state}
                    </p>
                </div>

                <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-gray-700">
                        {isVideoOn ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="bg-gray-700 p-6 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-gray-900/60 px-3 py-1 rounded-lg">
                            You
                        </div>
                    </div>
                    
                    {shareStream && (
                        <div className="relative rounded-2xl overflow-hidden bg-gray-800 shadow-lg border border-gray-700">
                            <video
                                ref={screenRef}
                                autoPlay
                                muted
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4 bg-gray-900/60 px-3 py-1 rounded-lg">
                                Your Screen
                            </div>
                        </div>
                    )}
                    
                    <ShowPeers />
                </div>

                <div className="bg-gray-800 border-t border-gray-700 p-6">
                    <div className="w-full flex items-center justify-center space-x-4">
                        <button
                            onClick={async () => {
                                try {
                                    if (isVideoOn) {
                                        await disableVideo();
                                    } else {
                                        await enableVideo();
                                    }
                                } catch (error) {
                                    console.error("Video toggle error:", error);
                                }
                            }}
                            className={`p-4 rounded-full ${isVideoOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"} transition-colors`}
                        >
                            {isVideoOn ? "Disable Video" : "Enable Video"}
                        </button>
                        <button
                            onClick={async () => {
                                try {
                                    if (isAudioOn) {
                                        await disableAudio();
                                    } else {
                                        await enableAudio();
                                    }
                                } catch (error) {
                                    console.error("Audio toggle error:", error);
                                }
                            }}
                            className={`p-4 rounded-full ${isAudioOn ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"} transition-colors`}
                        >
                            {isAudioOn ? "Disable Audio" : "Enable Audio"}
                        </button>
                        <button
                            onClick={async () => {
                                try {
                                    if (shareStream) {
                                        await stopScreenShare();
                                    } else {
                                        await startScreenShare();
                                    }
                                } catch (error) {
                                    console.error("Screen share toggle error:", error);
                                }
                            }}
                            className={`p-4 rounded-full ${shareStream ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-600 hover:bg-gray-500"} transition-colors`}
                        >
                            {shareStream ? "Stop Sharing" : "Share Screen"}
                        </button>
                        <button 
                            onClick={() => {
                                leaveRoom();
                                router.push('/my-classes');
                            }}
                            className="px-6 py-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                            Leave
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
