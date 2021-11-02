import styles from "./RequestForm.module.css";
import { Form, Col, Row, Button, Container, InputGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "redaxios";

const RequestForm = () => {
  // set all selectbox option value
  const arrCryptoType = [
    {
      value: "btc",
      html: "BTC",
    },
    { value: "eth", html: "ETH" },
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
    // optionType: "call",
    // optionPrice: 0,
    // optionCurrency: "usd",
    // optionSide: "buy",
    optionSize: 1,
    timeHorizon: 1,
    optionEndDate: defaultDate.toISOString(),
  };

  const [formObj, setFormObj] = useState(formObjInit);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    let cost = await axios.post(`${process.env.REACT_APP_SERVER}/quote`, {
      formObj,
    });

    console.log(cost.data);

    // if (form.checkValidity()) {
    //   setValidated(true);
    //   await axios.get(`${process.env.REACT_APP_SERVER}/quote`, {
    //     formObj,
    //   });

    //   // reset formObj to default
    //   setFormObj(formObjInit);
    //   setIsSubmitDisable(false);
    //   // setValidated(false);
    // }
  }

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
    <div className="FormQuote">
      <div className="color">
        <Container className={styles.container}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* <Row id="formTitle">
              <h2 className="mb-3">Crypto Hedging</h2>
            </Row> */}
            <Row>
              {/* underlying */}
              <Form.Group
                className="mb-3"
                as={Col}
                md="6"
                controlId="underlying"
              >
                <Form.Label>What asset do you hold?</Form.Label>
                <Form.Control
                  as="select"
                  required={true}
                  type="text"
                  defaultValue="{formObj.underlying}"
                  onChange={(e) => {
                    setFormObj({ ...formObj, underlying: e.target.value });
                    console.log("formObj.underlying:", formObj.underlying);
                  }}
                >
                  {arrCryptoType.map((element) => {
                    return (
                      <option value={element.value}>{element.html}</option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              {/* optionType */}
              {/* <Form.Group
                className="mb-3"
                as={Col}
                md="4"
                controlId="optionType"
              >
                <Form.Label>Option Type</Form.Label>
                <Form.Control
                  disabled
                  as="select"
                  required={true}
                  type="text"
                  defaultValue={formObj.optionType}
                  onChange={(e) => {
                    setFormObj({ ...formObj, optionType: e.target.value });
                    console.log("formObj.underlying:", formObj.optionType);
                  }}
                >
                  {arrOptionType.map((element) => {
                    return (
                      <option value={element.value}>{element.html}</option>
                    );
                  })}
                </Form.Control>
              </Form.Group> */}
              {/* optionSide */}
              {/* <Form.Group
                className="mb-3"
                as={Col}
                md="4"
                controlId="optionSide"
              >
                <Form.Label>Option Side</Form.Label>
                <Form.Control
                  disabled
                  as="select"
                  required={true}
                  type="text"
                  defaultValue={formObj.optionSide}
                  onChange={(e) => {
                    setFormObj({ ...formObj, optionSide: e.target.value });
                    console.log("formObj.underlying:", formObj.optionSide);
                  }}
                >
                  {arrOptionSide.map((element) => {
                    return (
                      <option value={element.value}>{element.html}</option>
                    );
                  })}
                </Form.Control>
              </Form.Group> */}
              {/* optionSize */}
              <Form.Group
                className="mb-3"
                as={Col}
                md="6"
                controlId="optionSize"
              >
                <Form.Label>What much do you hold?</Form.Label>
                <InputGroup>
                  <Form.Control
                    as="input"
                    required={true}
                    type="number"
                    defaultValue={formObj.optionSize}
                    onChange={(e) => {
                      setFormObj({ ...formObj, optionSize: e.target.value });
                      console.log("formObj.underlying:", formObj.optionSize);
                    }}
                    min={1}
                  ></Form.Control>
                  <InputGroup.Text id="inputGroupCrypto">
                    {formObj.underlying.toUpperCase()}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {/* timeHorizon */}
              <Form.Group
                className="mb-3"
                as={Col}
                md="6"
                controlId="timeHorizon"
              >
                <Form.Label>
                  How long do you want to protect your asset?
                </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    as="input"
                    required={true}
                    type="number"
                    defaultValue={formObj.timeHorizon}
                    onChange={(e) => {
                      let newDate = new Date();
                      newDate.setDate(
                        newDate.getDate() + parseInt(e.target.value)
                      );
                      // newDate.toISOString();
                      console.log(newDate);
                      setFormObj({
                        ...formObj,
                        timeHorizon: e.target.value,
                        optionEndDate: newDate.toISOString(),
                      });
                    }}
                    min={1}
                  ></Form.Control>
                  <InputGroup.Text id="inputGroupDay">
                    Day
                    {formObj.timeHorizon > 1 ? <span>s</span> : null}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              {/* optionEndDate */}
              <Form.Group
                className="mb-3"
                as={Col}
                md="4"
                controlId="optionEndDate"
              >
                <Row>
                  <Form.Label>End Date</Form.Label>
                </Row>
                <Row>
                  <Form.Label>{formObj.optionEndDate}</Form.Label>
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
                  Quote
                </Button>
              </div>
            </Row>
            <Row>
              {/* show input value */}
              {/* <div>
                <p className="mb-3">
                  {`Underlying: ${formObj.underlying.toUpperCase()}`}
                </p>
                <p>{`Option Type: ${formObj.optionType}`}</p>
                <p>{`Option Side:  ${formObj.optionSide}`}</p>
                <p>
                  {`Option Size: ${
                    formObj.optionSize
                  } ${formObj.underlying.toUpperCase()}`}
                </p>
                <p>
                  {`Time Horizon: ${formObj.timeHorizon} Day`}
                  {formObj.timeHorizon > 1 ? <span>s</span> : null}
                </p>
                <p>{`End Date: ${formObj.optionEndDate}`}</p>
                <p></p>
              </div> */}
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
