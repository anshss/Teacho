import { AccessToken, Role } from '@huddle01/server-sdk/auth';

export default async function handler(
  req,
  res
) {
  const { roomId } = req.query;

  if (!roomId) {
    return res.status(400).json({ error: 'roomId is required' });
  }

  const accessToken = new AccessToken({
    apiKey: process.env.NEXT_PUBLIC_HUDDLE_API_KEY,
    roomId: roomId,
    role: Role.HOST,
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
    }
  });

  const token = await accessToken.toJwt();

  return res.status(200).json({ token });
}