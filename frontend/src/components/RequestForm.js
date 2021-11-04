import styles from "./RequestForm.module.css";
import { Form, Col, Row, Button, Container, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "redaxios";

const RequestForm = () => {
  // set all selectbox option value

  const arrCryptoType = [
    {
      value: "BTC",
      html: "BTC",
    },
    { value: "ETH", html: "ETH" },
  ];
  const arrOptionType = [
    {
      value: "call",
      html: "Call",
    },
    // {
    //   value: "put",
    //   html: "Put",
    // },
  ];
  const arrOptionSide = [{ value: "buy", html: "Buy" }];

  // set all var state
  const [validated, setValidated] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  // Set state as a whole object
  let defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 1);
  const formObjInit = {
    underlying: "BTC",
    quantity: 1,
    expiryDate: 1,
    optionEndDate: defaultDate.toISOString(),
    // optionType: "call",
    // optionPrice: 0,
    // optionCurrency: "usd",
    // optionSide: "buy",
  };
  const [formObj, setFormObj] = useState(formObjInit);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formObj);
    const form = e.currentTarget;
    console.log(e);
    console.log(form);
    if (form.checkValidity()) {
      setValidated(true);
      let cost = await axios.post(`${process.env.REACT_APP_SERVER}/quote`, {
        formObj,
      });
      console.log(cost.data);

      // reset formObj to default
      setFormObj(formObjInit);
      setIsSubmitDisable(false);
      setValidated(false);
    }
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // console.log(isSubmitDisable);
  //   // setIsSubmitDisable(true);
  //   // console.log(isSubmitDisable);
  //   // setIsSubmitDisable(false);
  //   // console.log(isSubmitDisable);

  //   const form = event.currentTarget;
  //   if (form.checkValidity()) {
  //     setValidated(true);
  //     let quote = await axios.get(`${process.env.REACT_APP_SERVER}/quote`, {
  //       formObj,
  //     });

  //     // reset formObj to default
  //     setFormObj(formObjInit);
  //     setIsSubmitDisable(false);
  //     // setValidated(false);
  //   }
  // };

  return (
    <div className={styles.FormQuote}>
      <div className={styles.color}>
        <Container className={styles.container}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              {/* underlying */}
              <Form.Group
                className="mb-3"
                as={Col}
                md="12"
                controlId="underlying"
              >
                <Form.Label className={styles["form-label"]}>
                  What asset do you hold?
                </Form.Label>
                <Form.Control
                  name="underlying"
                  as="select"
                  required={true}
                  type="text"
                  value="{formObj.underlying}"
                  onChange={(e) => {
                    setFormObj({ ...formObj, underlying: e.target.value });
                    console.log(formObj);
                    console.log("formObj.underlying:", formObj.underlying);
                  }}
                >
                  {arrCryptoType.map((element) => {
                    return (
                      <option
                        className={styles["select-option"]}
                        value={element.value}
                      >
                        {element.html}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              {/* quantity */}
              <Form.Group
                className="mb-3"
                as={Col}
                md="12"
                controlId="quantity"
              >
                <Form.Label className={styles["form-label"]}>
                  How much do you hold?
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    name="quantity"
                    as="input"
                    required={true}
                    type="number"
                    min={0.01}
                    step="any"
                    value={formObj.quantity}
                    onChange={(e) => {
                      // handle empty input value

                      e.target.value && e.target.value >= 0.01
                        ? setFormObj({ ...formObj, quantity: e.target.value })
                        : setFormObj({ ...formObj, quantity: 0.01 });
                      console.log("formObj.underlying:", formObj.quantity);
                    }}
                    min={1}
                  ></Form.Control>
                  <InputGroup.Text
                    className={styles["input-group"]}
                    id="inputGroupCrypto"
                  >
                    {formObj.underlying.toUpperCase()}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {/* expiryDate */}
              <Form.Group
                className="mb-3"
                as={Col}
                md="12"
                controlId="expiryDate"
              >
                <Form.Label className={styles["form-label"]}>
                  How long do you want to protect your asset?
                </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    name="expiryDate"
                    as="input"
                    required={true}
                    type="number"
                    value={formObj.expiryDate}
                    min={1}
                    step={1}
                    onChange={(e) => {
                      let newDate = new Date();
                      // handle empty input value
                      if (e.target.value) {
                        newDate.setDate(
                          newDate.getDate() +
                            Math.round(parseInt(e.target.value))
                        );
                        setFormObj({
                          ...formObj,
                          expiryDate: Math.round(parseInt(e.target.value)),
                          optionEndDate: newDate.toISOString(),
                        });
                      } else {
                        newDate.setDate(
                          newDate.getDate() + parseInt(formObjInit.expiryDate)
                        );

                        setFormObj({
                          ...formObj,
                          expiryDate: 1,
                          optionEndDate: newDate.toISOString(),
                        });
                      }

                      console.log(newDate);
                    }}
                    min={1}
                  ></Form.Control>
                  <InputGroup.Text
                    className={styles["input-group"]}
                    id="inputGroupDay"
                  >
                    Day
                    {formObj.expiryDate > 1 ? <span>s</span> : null}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {/* optionEndDate */}
              <Form.Group
                className="mb-3"
                as={Col}
                md="12"
                controlId="optionEndDate"
              >
                <Row>
                  <Form.Label
                    name="optionEndDate"
                    className={styles["form-label"]}
                  >
                    Option End Date
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Label>
                    {new Date(formObj.optionEndDate).toString()}
                  </Form.Label>
                </Row>
              </Form.Group>
            </Row>
            <Row>
              {/* submit button */}
              <div className=" mb-3 d-grid gap-2">
                <Button
                  disabled={isSubmitDisable}
                  id="btnQuote"
                  variant="primary"
                  size="md"
                  type="submit"
                >
                  QUOTE
                </Button>
              </div>
            </Row>
            <Row>
              {/* show json format */}
              {validated && <p>{JSON.stringify(formObj, null, 4)}</p>}
            </Row>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default RequestForm;
