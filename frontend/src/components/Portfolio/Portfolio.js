import { ListGroup, Table, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "redaxios";
import { useEffect, useState } from "react";

import styles from "./Portfolio.module.sass";

const Portfolio = () => {
  const wallet = useSelector((state) => state.wallet);
  const [transactions, seTransactions] = useState([]);
  const [titles, settitles] = useState("");
  const [details, setdetails] = useState([]);

  async function getTitles(data) {
    if (data) {
      settitles(Object.keys(data));
    }
  }

  async function getDetails(data) {
    let detailList = [];
    for (let each of data) {
      let detail = Object.values(each);
      detailList.push(detail);
    }
    setdetails(detailList);
  }

  useEffect(async () => {
    let transactions = await axios.post(
      `${process.env.REACT_APP_SERVER}/getTransactions`,
      { walletID: wallet.walletAddress[0] }
    );
    seTransactions(transactions.data);
    await getTitles(transactions.data[0]);
    await getDetails(transactions.data);
  }, [seTransactions]);

  console.log(details);

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
            <tr>{titles[0] ? titles.map((each) => <th>{each}</th>) : null}</tr>
          </thead>
          <tbody>
            <tr>{titles[0] ? titles.map((each) => <th>{each}</th>) : null}/</tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Portfolio;
