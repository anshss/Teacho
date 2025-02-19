// import { useEffect, useState } from "react";
// import { pn } from "../config";
// import {
//     setAccount,
//     setUser,
// } from "../store/index.js";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import { getEthersProvider } from "@/functions";

// export default function Login() {
//     const dispatch = useDispatch();
//     // console.count("reloading page");
//     // console.log("i am in login page")
//     const [logged, setLogged] = useState(null);
//     const { wAddress, userInfo } = useSelector((state) => state.login);

//     const ethersProvider = getEthersProvider();

//     pn.setAuthTheme({
//         uiMode: "light",
//         displayCloseButton: true,
//         displayWallet: true, // display wallet entrance when send transaction.
//         modalBorderRadius: 10, // auth & wallet modal border radius. default 10.
//     });

//     useEffect(() => {
//         checkLogin();
//     }, [wAddress, userInfo]);

//     useEffect(() => {
//         const isLogged = checkLogin();
//         if (userInfo == "" && isLogged) {
//             getUserInfo();
//             if (localStorage.getItem("wAddress")) {
//                 let wAddressLocal = localStorage.getItem("wAddress");
//                 dispatch(setAccount(wAddressLocal));
//             } else {
//                 fetchAccount();
//             }
//         }
//     }, []);

//     const checkLogin = () => {
//         let result = pn.auth.isLogin();
//         setLogged(result);
//         return result;
//     };

//     const login = async () => {
//         await pn.auth.login({
//             preferredAuthType: "google",
//         });
//         console.log("wAddress", wAddress);
//         getUserInfo();
//         fetchAccount();
//     };

//     const fetchAccount = async () => {
//         const accounts = await ethersProvider.listAccounts();
//         dispatch(setAccount(accounts[0]));
//         localStorage.setItem("wAddress", accounts[0]);
//     };

//     const logout = async () => {
//         pn.auth.logout().then(() => {
//             console.log("logout");
//             dispatch(setAccount(null));
//             dispatch(setUser(null));
//         });
//     };

//     const getUserInfo = () => {
//         const info = pn.auth.userInfo();
//         dispatch(setUser(info));
//         console.log(info);
//     };

//     return (
//         <div>
//             {logged ? (
//                 <button onClick={logout}>logout</button>
//             ) : (
//                 <button onClick={login}>login</button>
//             )}
//             {/* <button onClick={debug}>check</button> */}
//         </div>
//     );
// }
