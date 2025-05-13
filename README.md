# Teacho

A platform for teachers to host classes and students to buy access to them using blockchain technology.

[![Contract](https://img.shields.io/badge/Contract-Base%20Sepolia-green)](https://sepolia.base.com/address/0xF8E9F063228eb47137101eb863BF3976466AA31F)

## Overview

Teacho enables anyone to host and monetize online lectures using blockchain technology. Key features:

- Teachers create classes with flow-rate pricing using Superfluid
- Students pay 10% upfront to establish trust
- Live video meetings via Huddle01 SDK
- Money streams between students and teachers during meetings
- Students only pay for the time they attend
- NFT generation for class attendees

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MetaMask or other Web3 wallet
- Base Sepolia testnet configured in your wallet
- Huddle01 API key

## Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/teacho.git
cd teacho
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following:
```
# Huddle01 API Key - get from huddle01.com
HUDDLE01_API_KEY=your-api-key-here

# Other environment variables
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Get a Huddle01 API key from [huddle01.com](https://www.huddle01.com/) and add it to your `.env.local` file

5. Run the development server
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

### For Teachers
1. Connect your wallet
2. Create a class with description, timing, and pricing
3. When it's time for the class, click "Launch Meeting"
4. Teach your class and receive payment streams in real-time

### For Students
1. Connect your wallet
2. Browse available classes and purchase access
3. Pay 10% deposit upfront
4. Join the meeting at the scheduled time
5. Money streams to the teacher only while you're in the meeting

## Video Meeting Functionality

This project uses Huddle01 to create interactive video meetings between teachers and students:

1. Teachers create classes which generate a meeting room ID
2. Students buy access to classes through smart contracts
3. When it's time for the class, both teacher and students click "Launch Meeting"
4. The meeting supports video, audio, and screen sharing

### Testing Locally
1. Open the application in two different browsers (or normal + incognito)
2. Navigate to the My Classes page in both
3. Click "Launch Meeting" for the same class in both browsers
4. You should see both participants in the same video room

## Technologies Used

- **Frontend**: Next.js, React, TailwindCSS
- **Blockchain**: Solidity, Superfluid Protocol, Base Sepolia Testnet
- **Video**: Huddle01 SDK
- **Authentication**: Web3 wallet connection

## Troubleshooting

If you encounter the "Producer Not Found" error when toggling video/audio:

1. Enable video/audio first before trying to disable it
2. Check browser console logs for detailed error information
3. Ensure proper browser permissions for camera/microphone access
4. Make sure your browser supports WebRTC (Chrome, Firefox, and Edge recommended)

## License

MIT

