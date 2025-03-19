import { AccessToken, Role } from "@huddle01/server-sdk/auth";

export default async function handler(req, res) {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    if (!process.env.NEXT_PUBLIC_HUDDLE_API_KEY) {
      console.error("Huddle API key is missing.");
      return res.status(500).json({ error: "API Key is missing" });
    }

    const accessToken = new AccessToken({
      apiKey: process.env.NEXT_PUBLIC_HUDDLE_API_KEY,
      roomId,
      role: Role.HOST, // Using Huddle's Role Enum
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
    });

    const token = await accessToken.toJwt(); // Ensure it is awaited

    if (!token) {
      return res.status(500).json({ error: "Failed to generate token" });
    }

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating access token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
