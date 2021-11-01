import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addWallet } from "../redux/walletSlice";
import axios from "redaxios";

function Wallet() {
  let dispatch = useDispatch();
  async function click() {
    if (!window.ethereum) {
      window.alert("install metamask");
    } else {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      await axios.post(`${process.env.REACT_APP_SERVER}/connectWallet`, {
        walletId: account,
      });
      dispatch(addWallet(account));
    }
  }

  return (
    <div>
      <Button onClick={click} variant="dark">
        <i className="fas fa-wallet fa-2x" style={{ color: "#00cc6a" }}></i>
      </Button>
    </div>
  );
}

export default Wallet;
