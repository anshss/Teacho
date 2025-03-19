import { useState } from "react";
import { ethers } from "ethers";
import web3modal from "web3modal";
import { address, abi } from "../config.js";
import styles from "../styles/style";
import { Navbar } from "../components";
import { Input, Stack } from "@chakra-ui/react";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";

import { Heading } from "@chakra-ui/react";

export default function Publish() {
    const [formInput, setFormInput] = useState({
        title: "",
        description: "",
        startTime: "",
        stringFlowRate: "",
    });

    console.log(formInput);

    // ✅ FIXED: Properly fetch `roomId`
    async function createMeeting() {
        try {
            const response = await fetch(`http://localhost:3000/api/create-room`);
            const resJson = await response.json();

            if (!resJson.roomId) {
                console.error("Failed to get roomId:", resJson);
                return null;  // Return null if no roomId is received
            }

            return resJson.roomId; // Correct way to access roomId
        } catch (error) {
            console.error("Error creating meeting:", error);
            return null;
        }
    }

    // ✅ FIXED: Ensure `roomId` is valid before publishing
    async function publish() {
        const meetingId = await createMeeting();

        if (!meetingId || !formInput.title || !formInput.description || !formInput.startTime || !formInput.stringFlowRate) {
            console.error("Missing required fields or roomId is not generated.");
            return;
        }

        const calculatedFlowRate = 385802469135802;

        const modal = new web3modal({
            network: "mumbai",
            cacheProvider: true,
        });
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(address, abi, signer);
        const parseStringFlowRate = ethers.utils.parseEther(formInput.stringFlowRate);

        const publishTx = await contract.createGig(
            formInput.title,
            formInput.description,
            formInput.startTime,
            meetingId,  // ✅ Now correctly received
            calculatedFlowRate,
            parseStringFlowRate,
            { gasLimit: 1000000 }
        );

        await publishTx.wait();
        console.log("Class successfully published!");
    }

    // ✅ FIXED: Debug function to properly check `roomId`
    async function debug() {
        const roomId = await createMeeting();
        console.log("Generated Room ID:", roomId);
    } 

    return (
        <div className="bg-primary w-full overflow-hidden min-h-screen">
            {/* <button onClick={debug}>debug</button> */}
            <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                    <Navbar />
                </div>
            </div>
            <div className={`bg-primary ${styles.flexStart} mt-5 text-center`}>
                <div className={`${styles.boxWidth}`}>
                    <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
                        Host your{" "}
                        <span className="text-gradient">First Lecture</span>{" "}
                    </h1>
                </div>
            </div>

            <div className={`bg-primary ${styles.flexStart}`}>
                <div className={`${styles.boxWidth}`}>
                    <section
                        className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow mx-20`}
                    >
                        <div className="flex-1 flex flex-col">
                            <h2 className={styles.heading2}>
                                Fill the given details.
                            </h2>
                            <div>
                                <Stack gap={2}>
                                    <FormControl>
                                        <FormLabel fontSize={20} mb={1}>
                                            Title
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            w="100%"
                                            borderRadius={8}
                                            py={2}
                                            px={2}
                                            color={"black"}
                                            name="title"
                                            placeholder="Title"
                                            required
                                            value={formInput.title}
                                            onChange={(e) =>
                                                setFormInput({
                                                    ...formInput,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                        {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Description</FormLabel>
                                        <Input
                                            type="text"
                                            w="100%"
                                            borderRadius={8}
                                            py={2}
                                            px={2}
                                            color={"black"}
                                            name="description"
                                            placeholder="Description"
                                            required
                                            onChange={(e) =>
                                                setFormInput({
                                                    ...formInput,
                                                    description: e.target.value,
                                                })
                                            }
                                            value={formInput.description}
                                        />
                                        {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                                    </FormControl>
                                    <div className="flex gap-5">
                                        <FormControl className="flex-1">
                                            <FormLabel>Meeting Time</FormLabel>
                                            <Input
                                                type="datetime-local"
                                                w="100%"
                                                borderRadius={8}
                                                py={2}
                                                px={2}
                                                color={"black"}
                                                name="startTime"
                                                placeholder="Meeting Time"
                                                required
                                                value={formInput.startTime}
                                                onChange={(e) =>
                                                    setFormInput({
                                                        ...formInput,
                                                        startTime:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                                        </FormControl>
                                        <FormControl className="flex-1">
                                            <FormLabel>
                                                Flow Rate(Eth/Hour)
                                            </FormLabel>
                                            <NumberInput
                                                value={formInput.stringFlowRate}
                                                onChange={(rate) =>
                                                    setFormInput({
                                                        ...formInput,
                                                        stringFlowRate: rate,
                                                    })
                                                }
                                            >
                                                <NumberInputField
                                                    w="100%"
                                                    borderRadius={8}
                                                    py={2}
                                                    px={2}
                                                    color={"black"}
                                                    name="flowrate"
                                                    placeholder="eth/hour"
                                                    required
                                                />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>
                                    </div>
                                </Stack>
                            </div>
                            <div className={`mt-8`}>
                                <button
                                    type="button"
                                    onClick={publish}
                                    className={`py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`}
                                >
                                    Host Class
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
