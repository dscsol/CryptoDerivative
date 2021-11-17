import FormQuote from "./FormQuote";
import { Container } from "react-bootstrap";
import styles from "./Form.module.sass";

const Form = () => {
  return (
    <div className={styles["background"]}>
      <Container className={styles["container"]}>
        <FormQuote />
      </Container>
    </div>
  );
};

export default Form;
