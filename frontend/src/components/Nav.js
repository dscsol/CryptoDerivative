import React from "react";
import { Navbar, Container } from "react-bootstrap";
import Wallet from "./Wallet";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function Nav() {
  let address = useSelector((state) => {
    if (state.wallet.walletAddress[0]) {
      let displayAddress = state.wallet.walletAddress[0].split("");
      displayAddress.splice(4, 35, "...");
      return displayAddress.join("");
    }
  });

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <strong>EasyHedge</strong>
          </Navbar.Brand>
          <strong>
            <Link to="/portfolio" style={{ color: "white" }}>
              portfolio
            </Link>
          </strong>
          {address ? (
            <Navbar.Brand style={{ color: "white" }}>
              Address: {address}
            </Navbar.Brand>
          ) : (
            <Wallet />
          )}
        </Container>
      </Navbar>
    </div>
  );
}

export default Nav;
