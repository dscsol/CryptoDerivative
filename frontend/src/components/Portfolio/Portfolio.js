import { ListGroup, Table, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "redaxios";
import { useEffect, useState } from "react";

import styles from "./Portfolio.module.sass";

const Portfolio = () => {
  const wallet = useSelector((state) => state.wallet);
  const [transactions, setTransactions] = useState();
  useEffect(async () => {
    await axios
      .post(`${process.env.REACT_APP_SERVER}/getTransactions`, {
        walletID: wallet.walletAddress[0],
      })
      .then((res) => {
        console.log(res.data);
        setTransactions(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className={styles["background"]}>
      <Container>
        <h2>Portfolio</h2>
        {/* <ListGroup>
          <ListGroup.Item>
            Wallet address: {wallet.walletAddress}
          </ListGroup.Item>
        </ListGroup> */}

        {!!transactions ? (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                {Object.keys(transactions[0]).map((name) => {
                  return <th>{name}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, i) => {
                return (
                  <tr>
                    <td>{i + 1}</td>
                    {Object.keys(transaction).map((name) => {
                      return (
                        <>
                          <td>{transaction[name]}</td>
                        </>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p>No data</p>
        )}
      </Container>
    </div>
  );
};

export default Portfolio;
