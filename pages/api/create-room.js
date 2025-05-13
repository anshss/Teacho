import axios from 'axios';
 
 
const handler = async (req, res) => {
  try {
    const { data } = await axios.post(
      'https://api.huddle01.com/api/v2/sdk/rooms/create-room',
      {
        title: 'Huddle01-Test',
        roomLock: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_HUDDLE_API_KEY,
        },
      }
    );
 
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
 
export default handler;