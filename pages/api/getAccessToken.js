import { AccessToken, Role } from '@huddle01/server-sdk/auth';

export default async function handler(req, res) {
  try {
    const { roomId } = req.query;
    
    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }

    // You should store your API key in environment variables
    // Replace process.env.HUDDLE01_API_KEY with your actual API key if testing
    const apiKey = process.env.NEXT_PUBLIC_HUDDLE_API_KEY || 'your-api-key-here';
    
    const accessToken = new AccessToken({
      apiKey: apiKey,
      roomId: roomId,
      role: Role.HOST, // Default to HOST, but you could pass role in the request
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

    const token = await accessToken.toJwt();
    
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
}