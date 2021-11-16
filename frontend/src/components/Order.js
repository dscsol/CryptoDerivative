import { useSelector } from "react-redux";
import { ListGroup, Button } from "react-bootstrap";

const Order = () => {
  const form = useSelector((state) => state.quoteForm);
  const price = useSelector((state) => state.quotePrice);
  console.log(form);
  return (
    <div>
      <h2>Order Details</h2>
      <ListGroup>
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
        <Button>Confirm Purchasing</Button>
      </div>
    </div>
  );
};

export default Order;
