import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
    address,
    abi,
    forwarderAddress,
    forwarderABI,
    superTokenAddress,
} from "../config.js";
import styles from "../styles/style";
import { Navbar } from "../components";
import { useRouter } from 'next/router'

export default function MyClasses() {
    const router = useRouter()

    // const receiverAddress = `0x248F5db296Ae4D318816e72c25c93e620341f621`;
    // const flowRate = `385802469135802`;

    const [superToken, setSuperToken] = useState();
    const [gigs, setGigs] = useState([]);
    const [userAddress, setUserAddress] = useState();

    async function joinMeeting(prop) {
        // await startFlow(prop.host, prop.flowRate);
        // await getFlowInfo(prop.host);
        router.push(`/${prop.meetingId}`);
    }

    async function endMeeting(prop) {
        if (leaveRoom.isCallable) {
            leaveRoom();
        }
        stopHardware();
        await stopFlow(prop.host);
    }

    useEffect(() => {
        fetchUserAddress();
        fetchMyClasses();
    }, []);

    async function fetchUserAddress() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let accounts = await provider.send("eth_requestAccounts", []);
        let senderAddress = accounts[0];
        setUserAddress(senderAddress);
        return senderAddress;
    }

    async function fetchMyClasses() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let accounts = await provider.send("eth_requestAccounts", []);
        let senderAddress = accounts[0];
        const contract = new ethers.Contract(address, abi, provider);
        const data = await contract.myClasses(senderAddress);
        const itemsFetched = await Promise.all(
            data.map(async (i) => {
                let parseStringFlowRate = ethers.utils.formatEther(
                    i.stringFlowRate
                );
                let item = {
                    host: i.host.toString(),
                    title: i.title,
                    description: i.description,
                    time: i.time,
                    meetingId: i.meetingId,
                    flowRate: i.flowRate.toNumber(),
                    stringFlowRate: parseStringFlowRate,
                    gigId: i.gigId.toNumber(),
                    nftTokenId: i.nftTokenId.toNumber(),
                    attendees: i.attendees.toNumber(),
                };
                return item;
            })
        );

        console.log("inventory", itemsFetched);
        setGigs(itemsFetched);

        return itemsFetched;
    }

    async function startFlow(xReceiverAddress, xFlowRate) {
        console.log("startFlow", xReceiverAddress, xFlowRate);
        const senderAddress = await fetchUserAddress();
        if (senderAddress.toUpperCase() == xReceiverAddress.toUpperCase()) {
            console.log("same address");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const forwarderContract = new ethers.Contract(
            forwarderAddress,
            forwarderABI,
            provider.getSigner()
        );

        const txnResponse = await forwarderContract.createFlow(
            superTokenAddress,
            senderAddress,
            xReceiverAddress,
            xFlowRate,
            "0x"
        );

        const txnReceipt = await txnResponse.wait();
        console.log("started");
        console.log(txnReceipt);
        console.log(
            `https://app.superfluid.finance/dashboard/${xReceiverAddress}`
        );
    }

    async function stopFlow(xReceiverAddress) {
        if (senderAddress.toUpperCase() == xReceiverAddress.toUpperCase()) {
            console.log("same address");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const forwarderContract = new ethers.Contract(
            forwarderAddress,
            forwarderABI,
            provider.getSigner()
        );

        const txnResponse = await forwarderContract.deleteFlow(
            superTokenAddress,
            userAddress,
            xReceiverAddress,
            "0x"
        );

        const txnReceipt = await txnResponse.wait();
        console.log("stopped");
        console.log(txnReceipt);
    }

    async function getFlowInfo(xReceiverAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const forwarderContract = new ethers.Contract(
            forwarderAddress,
            forwarderABI,
            provider.getSigner()
        );

        if (senderAddress.toUpperCase() == xReceiverAddress.toUpperCase()) {
            console.log("same address");
            return;
        }

        const txnResponse = await forwarderContract.getFlow(
            superTokenAddress,
            userAddress,
            xReceiverAddress,
            "0x"
        );

        const txnReceipt = await txnResponse.wait();
        console.log("flowInfo", txnReceipt);
    }

    function Card(prop) {
        const add0 = (t) => (t < 10 ? `0${t}` : String(t));
        const getDateStandard = (dt) => {
            const y = dt.getFullYear();
            const m = add0(dt.getMonth() + 1);
            const d = add0(dt.getDate()); //day of month
            const w = dt.toDateString().substring(0, 3); //day of week enum, either Mon, Tue, Wed, Thu, Fri, Sat, Sun
            const h = add0(dt.getHours());
            const min = add0(dt.getMinutes());
            return `${d}-${m}-${y} ${w} ${h}:${min}`;
        };
        const dateTime = new Date(prop.time);
        return (
            <div className={`bg-primary ${styles.flexStart}`}>
                <div className={`${styles.boxWidth}`}>
                    <section
                        className={`${styles.flexCenter} ${styles.marginY} !mb-0 ${styles.padding}sm:flex-row flex-col bg-black-gradient-3 rounded-[20px] box-shadow mx-10`}
                    >
                        <div className="flex-1 flex flex-col w-full">
                            <div className="flex items-center justify-between w-full">
                                <div className="grow-[3] max-w-[75%]">
                                    <h1 className="flex-1 font-poppins font-semibold ss:text-[40px] text-[32px] text-white ss:leading-[50.8px] leading-[45px] capitalize">
                                        {prop.title}
                                    </h1>
                                    <p className="font-thin text-slate-200 mt-1 leading-5">
                                        {prop.description}
                                    </p>
                                    <p className="mt-3 text-gray-500">
                                        Date: {getDateStandard(dateTime)}
                                    </p>
                                </div>
                                <div className="flex flex-1 justify-center items-end flex-col">
                                    <p className="mr-6">
                                        Price: {prop.stringFlowRate} Eth/Hour
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => joinMeeting(prop)}
                                        className={`py-4 mt-2 px-12 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`}
                                    >
                                        Launch Meeting
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary w-full overflow-hidden min-h-screen">
            <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                    <Navbar />
                </div>
            </div>
            <div className={`bg-primary ${styles.flexStart} mt-5 text-center`}>
                <div className={`${styles.boxWidth}`}>
                    <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
                        Purchases<span className="text-gradient"></span>{" "}
                    </h1>
                </div>
            </div>
            <div>
                <div className="flex">
                    <div className="pb-20 flex-1">
                        {gigs.map((item, i) => (
                            <Card
                                key={i}
                                host={item.host}
                                title={item.title}
                                description={item.description}
                                time={item.time}
                                meetingId={item.meetingId}
                                flowRate={item.flowRate}
                                stringFlowRate={item.stringFlowRate}
                                gigId={item.gigId}
                            />
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col items-center">

                    </div>
                </div>
            </div>
        </div>
    );
}
