import FormQuote from "./FormQuote";
import Order from "./Order";
import { useState } from "react";
import { Container, Spinner } from "react-bootstrap";

const Form = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Container>
        {error ? (
          <div>
            <h1>
              <strong>{error}</strong>
            </h1>
          </div>
        ) : isLoading ? (
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
        ) : isSubmit ? (
          <Order />
        ) : (
          <FormQuote
            formSubmit={setIsSubmit}
            formLoading={setIsLoading}
            formError={setError}
          ></FormQuote>
        )}
      </Container>
    </div>
  );
};

export default Form;
