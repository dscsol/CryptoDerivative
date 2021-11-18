import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const status = useSelector((state) => state.status);
  console.log(status.isLoading, status.error);
  console.log(rest);
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={(props) =>
        !!status.error ? (
          <div>
            <h1>
              <strong>{status.error}</strong>
            </h1>
          </div>
        ) : status.isLoading ? (
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
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
