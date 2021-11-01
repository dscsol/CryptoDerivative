import React from "react";
import { Navbar, Container } from "react-bootstrap";
import Wallet from "./Wallet";
import { useSelector } from "react-redux";

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
