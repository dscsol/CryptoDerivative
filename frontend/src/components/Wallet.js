import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import connectWallet from "./connectWallet";

function Wallet() {
  let dispatch = useDispatch();

  return (
    <div>
      <Button
        onClick={() => {
          connectWallet(dispatch);
        }}
        variant="dark"
      >
        <i className="fas fa-wallet fa-2x" style={{ color: "#00cc6a" }}></i>
      </Button>
    </div>
  );
}

export default Wallet;
