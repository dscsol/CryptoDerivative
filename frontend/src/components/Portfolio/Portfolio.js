import { ListGroup, Button, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "redaxios";
import styles from "./Portfolio.module.sass";

const Portfolio = () => {
  const wallet = useSelector((state) => state.wallet);

  return (
    <div className={styles["background"]}>
      <Container>
        <h2>Portfolio</h2>
        <ListGroup>
          <ListGroup.Item>
            Wallet address: {wallet.walletAddress}
          </ListGroup.Item>
        </ListGroup>
      </Container>
    </div>
  );
};

export default Portfolio;
