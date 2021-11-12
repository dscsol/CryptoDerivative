import Nav from "./components/Nav";
import { useDispatch } from "react-redux";
import { addWallet } from "./redux/walletSlice";
import web3 from "./web3";
import { useEffect } from "react";
import RequestForm from "./components/RequestForm";
import Form from "./components/Form";

function App() {
  let dispatch = useDispatch();

  useEffect(() => {
    window.onload = async function () {
      let data = await web3.eth.getAccounts();
      if (data[0]) {
        dispatch(addWallet(data[0]));
      }
    };
  });

  return (
    <div className="App">
      <Nav />
      {/* <RequestForm /> */}
      <Form />
    </div>
  );
}

export default App;
