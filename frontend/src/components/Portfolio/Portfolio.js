import { ListGroup, Table, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "redaxios";
import { useEffect, useState } from "react";

import styles from "./Portfolio.module.sass";

const Portfolio = () => {
  const wallet = useSelector((state) => state.wallet);
  const [transactions, seTransactions] = useState([]);
  useEffect(async () => {
    let transactions = await axios.post(
      `${process.env.REACT_APP_SERVER}/getTransactions`,
      { walletID: wallet.walletAddress[0] }
    );
    console.log(transactions.data);
    seTransactions(transactions.data);
  }, []);

  return (
    <div className={styles["background"]}>
      <Container>
        <h2>Portfolio</h2>
        <ListGroup>
          <ListGroup.Item>
            Wallet address: {wallet.walletAddress}
          </ListGroup.Item>
        </ListGroup>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              {Array.from({ length: 12 }).map((_, index) => (
                <th key={index}>Table heading</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              {Array.from({ length: 12 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr>
            <tr>
              <td>2</td>
              {Array.from({ length: 12 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr>
            <tr>
              <td>3</td>
              {Array.from({ length: 12 }).map((_, index) => (
                <td key={index}>Table cell {index}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Portfolio;
