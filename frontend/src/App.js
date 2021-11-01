import Nav from "./components/Nav";
import axios from "redaxios";
import { useDispatch } from "react-redux";
import { addWallet } from "./redux/walletSlice";
import web3 from "./web3";
import { useEffect } from "react";
import { useState } from "react";

function App() {
  let dispatch = useDispatch();
  let [info, setInfo] = useState("");

  async function fetch() {
    let result = await axios.get(`${process.env.REACT_APP_SERVER}/test`);
    console.log(result.data);
  }

  useEffect(() => {
    window.onload = async function () {
      let data = await web3.eth.getAccounts();
      if (data[0]) {
        dispatch(addWallet(data[0]));
      }
    };
    fetch();
  });

  return (
    <div className="App">
      <Nav />
    </div>
  );
}

export default App;
