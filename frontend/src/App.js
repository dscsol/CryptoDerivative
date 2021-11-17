import Nav from "./components/Nav";
import { useDispatch } from "react-redux";
import { addWallet } from "./redux/walletSlice";
import web3 from "./web3";
import { useEffect, Component } from "react";
import Form from "./components/Form";
import Order from "./components/Order";
import axios from "redaxios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";

function App() {
  let dispatch = useDispatch();

  // async function fetch() {
  //   await axios.get(`${process.env.REACT_APP_SERVER}/quote`);
  // }

  useEffect(() => {
    window.onload = async function () {
      let data = await web3.eth.getAccounts();
      if (data[0]) {
        dispatch(addWallet(data[0]));
      }
    };
  });

  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <PublicRoute component={Form} path="/" exact />
          <PublicRoute component={Order} path="/order" exact />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
