import { ParticleProvider } from "@particle-network/provider";
import { ethers } from "ethers";
import axios from "axios";
import { address, abi, pn } from "./config";

export const getEthersProvider = () => {
    const particleProvider = new ParticleProvider(pn.auth);
    const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
    );
    return ethersProvider
};

    // const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY;
    // const provider = new ethers.providers.JsonRpcProvider(
    //     `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_ID}`
    // );
