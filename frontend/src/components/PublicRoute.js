import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import connectWallet from "./connectWallet";

const PublicRoute = ({
  component: Component,
  requireWallet,
  requireSubmitQuote,
  ...rest
}) => {
  const status = useSelector((state) => state.status);
  const wallet = useSelector((state) => state.wallet);
  const dispatch = useDispatch();
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={(props) => {
        if (!!status.error) {
          return (
            <div>
              <h1>
                <strong>{status.error}</strong>
              </h1>
            </div>
          );
        } else if (status.isLoading) {
          return (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "250px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner animation="grow"> </Spinner>
              <Spinner animation="grow"> </Spinner>
              <Spinner animation="grow"> </Spinner>
            </div>
          );
        } else if (!status.isSubmitQuote && requireSubmitQuote) {
          alert("Please fill in the form");
          return <Redirect to="/" />;
        } else if (!wallet.walletAddress[0] && requireWallet) {
          connectWallet(dispatch);
          return <Redirect to="/" />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PublicRoute;
