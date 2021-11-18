import { useSelector, useDispatch } from "react-redux";
import { ListGroup, Button, Container } from "react-bootstrap";
import { changeStatus } from "../../redux/statusSlice";
import { addWallet } from "../../redux/walletSlice";
import axios from "redaxios";
import styles from "./Order.module.sass";
import { useHistory } from "react-router-dom";

const Order = () => {
  const form = useSelector((state) => state.quoteForm);
  const price = useSelector((state) => state.quotePrice);
  const wallet = useSelector((state) => state.wallet);
  console.log(price);
  console.log(form);
  console.log(wallet);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(changeStatus({ isLoading: true }));
    await axios
      .post(`${process.env.REACT_APP_SERVER}/buy`, {
        walletID: wallet.walletAddress[0],
        depositAsset: "USDC",
        depositQuantity: price.cost,
        symbol: price.symbol,
        quantity: form.quantity,
        price: price.cost,
      })
      .then((res) => {
        dispatch(changeStatus({ isLoading: false }));
        alert(res.data);
      })
      .catch((err) => {
        dispatch(changeStatus({ error: `${err.status} ${err.statusText}` }));
      });
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      window.alert("install metamask");
    } else {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      await axios.post(`${process.env.REACT_APP_SERVER}/connectWallet`, {
        walletID: account,
      });
      dispatch(addWallet(account));
    }
  };

  return (
    <div className={styles["background"]}>
      <Container className={styles["container"]}>
        <ListGroup className={styles["listGroup"]}>
          <h2>Order Details</h2>
          {Object.keys(form).map((name) => {
            return name === "endDate" || name === "period" ? null : (
              <ListGroup.Item>{`${name}: ${form[name]}`}</ListGroup.Item>
            );
          })}
          {Object.keys(price).map((name) => {
            return name === "expiryDate" ? (
              <ListGroup.Item>{`Expiry Date: ${new Date(
                price[name]
              ).toString()}`}</ListGroup.Item>
            ) : (
              <ListGroup.Item>{`${name}: ${price[name]}`}</ListGroup.Item>
            );
          })}
        </ListGroup>
        <div className=" mb-3 d-grid gap-2">
          {!wallet.walletAddress[0] ? (
            <Button
              onClick={(e) => {
                handleSubmit(e);
              }}
              className={styles["button"]}
            >
              Confirm Purchasing
            </Button>
          ) : (
            <Button
              className={styles["button"]}
              style={{ background: "lightgrey" }}
              onClick={connectWallet}
            >
              PLEASE CONNECT YOUR WALLET
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Order;
