import axios from "redaxios";
import { addWallet } from "../redux/walletSlice";

export default async function connectWallet(dispatch) {
  //  can't usedispatch
  if (!window.ethereum) {
    window.alert("install metamask");
  } else {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    dispatch(addWallet(account));
    await axios.post(`${process.env.REACT_APP_SERVER}/connectWallet`, {
      walletID: account,
    });
  }
}
