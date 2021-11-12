import FormQuote from "./FormQuote";
import FormSuccess from "./FormSuccess";
import { useState } from "react";
import { Container } from "react-bootstrap";

const Form = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  function submitForm() {
    setIsSubmit(true);
  }
  return (
    <div>
      <Container>
        {!isSubmit ? (
          <FormQuote submitForm={submitForm}></FormQuote>
        ) : (
          <FormSuccess />
        )}
      </Container>
    </div>
  );
};

export default Form;
