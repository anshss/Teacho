import { API } from '@huddle01/server-sdk/api';

const handler = async (req, res) => {
  try {
    const api = new API({
      apiKey: process.env.NEXT_PUBLIC_HUDDLE_API_KEY, // Ensure this is correctly set
    });

    const newRoom = await api.createRoom({
      roomLocked: false,  // Allowing access initially
      metadata: JSON.stringify({
        title: 'Huddle01 Meeting',
      }),
    });

    if (!newRoom || !newRoom.roomId) {
      return res.status(500).json({ error: "Failed to create room" });
    }

    res.status(200).json({ roomId: newRoom.roomId }); // Ensure roomId is sent properly
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
