import "@/styles/globals.css";
import { ChakraProvider, extendBaseTheme } from "@chakra-ui/react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

import { HuddleClient, HuddleProvider } from "@huddle01/react";

const huddleClient = new HuddleClient({
 projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
 options: {
   activeSpeakers: {
     size: 12,
   },
 },
});

const theme = extendBaseTheme({
    styles: {
        global: {
            "html, body": {
                color: "white",
                lineHeight: "tall",
            },
        },
    },
});

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const config = createConfig(
    getDefaultConfig({
        chains: [baseSepolia, sepolia],
        transports: {
            [baseSepolia.id]: http(),
            [sepolia.id]: http(),
        },
        walletConnectProjectId,
        appName: "Teacho",
        appDescription: "Your App Description",
        appUrl: "https://family.co",
        appIcon: "https://family.co/logo.png",
    })
);

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
    return (
        <div>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <ConnectKitProvider>
                        <ChakraProvider theme={theme}>
                          <HuddleProvider client={huddleClient}>
                            <Component {...pageProps} />
                          </HuddleProvider>
                        </ChakraProvider>
                    </ConnectKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </div>
    );
}
