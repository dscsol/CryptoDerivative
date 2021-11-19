import Nav from "./components/Nav";
import { useDispatch, useSelector } from "react-redux";
import { addWallet } from "./redux/walletSlice";
import web3 from "./web3";
import { useEffect } from "react";
import Form from "./components/Form/Form";
import Quote from "./components/Quote/Quote";
import Portfolio from "./components/Portfolio/Portfolio";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";

function App() {
  let dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);

  useEffect(() => {
    window.onload = async function () {
      let data = await web3.eth.getAccounts();
      if (!!data[0]) {
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
          <PublicRoute
            component={Quote}
            path="/quote"
            requireSubmitQuote={true}
            exact
          />
          <PublicRoute
            component={Portfolio}
            path="/portfolio"
            requireWallet={true}
            exact
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
