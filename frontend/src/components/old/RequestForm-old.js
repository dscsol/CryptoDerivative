import styles from "./RequestForm.module.sass";
import { Form, Col, Row, Button, Container, InputGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "redaxios";
import FormInput from "../FormInput";
import { useSelector, useDispatch } from "react-redux";
import {
  changeUnderlying,
  changeQuantity,
  changeExpiryDate,
  changeOptionEndDate,
} from "../../redux/quoteFormSlice";

const RequestForm = () => {
  const form = useSelector((state) => state.quoteForm);
  const dispatch = useDispatch();
  // set all selectbox option value
  const arrCryptoType = [
    { value: "BTC", html: "BTC" },
    { value: "ETH", html: "ETH" },
  ];
  // const arrOptionType = [
  //   {
  //     value: "call",
  //     html: "Call",
  //   },
  //   // {
  //   //   value: "put",
  //   //   html: "Put",
  //   // },
  // ];
  // const arrOptionSide = [{ value: "buy", html: "Buy" }];

  // const isLeapYear = (year) => {
  //   return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  // };
  // const days_of_a_year = (year) => {
  //   return isLeapYear(year) ? 366 : 365;
  // };

  // set all var state
  const [validated, setValidated] = useState(false);
  // const [isSubmitDisable, setIsSubmitDisable] = useState(false);
  const [errors, setErrors] = useState({});

  // Set state as a whole object
  let defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 1);
  const formObjInit = {
    underlying: "BTC",
    quantity: 1,
    expiryDate: 1,
    optionEndDate: defaultDate.toISOString(),
  };
  const [formObj, setFormObj] = useState(formObjInit);
  const [quote, setQuote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD:frontend/src/components/old/RequestForm-old.js
    console.log(form);
    // setErrors(handleError(formObj));
    // if (Object.keys(errors).length == 0) {
    //   setValidated(true);
    //   let cost = await axios.post(`${process.env.REACT_APP_SERVER}/quote`, {
    //     formObj,
    //   });

    //   setQuote(cost.data);

    //   // reset formObj to default
    //   // setFormObj(formObjInit);
    //   // setIsSubmitDisable(false);
    //   // setValidated(false);
    // }
======
>>>>>>> 9994d0daa328bcccc56ed37def2c3999529889e8:frontend/src/components/RequestForm.js
  };

  // input validation, return as obj
  const handleError = (obj) => {
    let newErrors = {};
    Object.keys(obj).forEach((name) => {
      switch (name) {
        case "underlying":
          if (!obj[name] || obj[name] === "") {
            newErrors[name] = "Please choose an asset.";
          }
          break;
        case "quantity":
          if (!obj[name] || obj[name] === "") {
            newErrors[name] = "Amount cannot be empty.";
          } else if (obj[name] < 0.001) {
            newErrors[name] = "Amount cannot be smaller than 0.001.";
          }
          break;
        case "expiryDate":
          if (!obj[name] || obj[name] === "") {
            newErrors[name] = "Period cannot be empty.";
          } else if (obj[name] < 1) {
            newErrors[name] = "Minimum period is 1 day.";
          } else if (obj[name] > 1462) {
            newErrors[name] = "Maximum period is 4 years.";
          }
          break;
        case "optionEndDate":
          if (!obj[name] || obj[name] === "") {
            newErrors[name] = "Period cannot be empty.";
          } else {
            let dayDiff = Math.ceil(
              (new Date(obj[name]) - new Date()) / (1000 * 60 * 60 * 24)
            );

            if (dayDiff < 1) {
              newErrors[name] = "Minimum period is 1 day.";
            } else if (dayDiff > 1462) {
              newErrors[name] = "Maximum period is 4 years.";
            }
          }
          break;
        default:
          newErrors = {};
      }
    });
    return newErrors;
  };

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
                  }}
                >
                  {arrCryptoType.map((element) => {
                    return (
                      <option
                        key={arrCryptoType.indexOf(element)}
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
                    step="any"
                    value={formObj.quantity}
                    isInvalid={Object.keys(errors).includes("quantity")}
                    onBlur={(e) => {
                      setErrors(handleError({ quantity: e.target.value }));
                    }}
                    onChange={(e) => {
                      setFormObj({ ...formObj, quantity: e.target.value });
                    }}
                  ></Form.Control>
                  <InputGroup.Text
                    className={styles["input-group"]}
                    id="inputGroupCrypto"
                  >
                    {formObj.underlying.toUpperCase()}
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.quantity}
                  </Form.Control.Feedback>
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
                    step={1}
                    onBlur={(e) => {
                      setErrors(
                        handleError({ expiryDate: formObj.expiryDate })
                      );
                      if (!Object.keys(errors).includes("expiryDate")) {
                        let newDate = new Date();
                        newDate.setDate(
                          newDate.getDate() +
                            Math.round(parseInt(e.target.value))
                        );
                        setFormObj({
                          ...formObj,
                          optionEndDate: newDate.toISOString(),
                        });
                      }
                    }}
                    isInvalid={Object.keys(errors).includes("expiryDate")}
                    onChange={(e) => {
                      setFormObj({
                        ...formObj,
                        expiryDate: Math.round(parseInt(e.target.value)),
                      });
                    }}
                  ></Form.Control>
                  <InputGroup.Text
                    className={styles["input-group"]}
                    id="inputGroupDay"
                  >
                    Day
                    {formObj.expiryDate > 1 ? <span>s</span> : null}
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.expiryDate}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              {/* optionEndDate */}
              {/* <Form.Group
                className="mb-3"
                as={Col}
                md="12"
                controlId="optionEndDate"
              >
                <Form.Label className={styles["form-label"]}>
                  Option End Date
                </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    className={styles["optionEndDate"]}
                    name="optionEndDate"
                    as="input"
                    required={true}
                    type="date"
                    value={formObj.optionEndDate.substring(0, 10)}
                    min={formObjInit.optionEndDate.substring(0, 10)}
                    max={
                      parseInt(formObjInit.optionEndDate.substring(0, 4)) +
                      4 +
                      formObjInit.optionEndDate.substring(4, 10)
                    }
                    onBlur={(e) => {
                      setErrors(handleError({ optionEndDate: e.target.value }));
                      if (!Object.keys(errors).includes("optionEndDate")) {
                        let dayDiff = Math.ceil(
                          (new Date(e.target.value) - new Date()) /
                            (1000 * 60 * 60 * 24)
                        );
                        setFormObj({
                          ...formObj,
                          expiryDate: dayDiff,
                        });
                      }
                    }}
                    onChange={(e) => {
                      setErrors(handleError({ optionEndDate: e.target.value }));
                      if (!Object.keys(errors).includes("optionEndDate")) {
                        let newDate = new Date();
                        newDate.setDate(
                          newDate.getDate() +
                            Math.round(parseInt(e.target.value))
                        );
                        setFormObj({
                          ...formObj,
                          optionEndDate: new Date(e.target.value).toISOString(),
                        });
                      }
                    }}
                    isInvalid={Object.keys(errors).includes("optionEndDate")}
                  ></Form.Control>
                  <InputGroup.Text
                    className={styles["input-group"]}
                    id={styles["inputGroupTimeZone"]}
                  >
                    {`0:00AM ${new Date(formObj.optionEndDate)
                      .toString()
                      .substring(25)}`}
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.optionEndDate}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group> */}
            </Row>
            <Row>
              {/* submit button */}
              <div className=" mb-3 d-grid gap-2">
                <Button
                  // disabled={isSubmitDisable}
                  id="btnQuote"
                  variant="primary"
                  size="md"
                  type="submit"
                >
                  QUOTE
                </Button>
              </div>
            </Row>

            <p>
              {quote
                ? `Your asset will be protected until ${new Date(
                    quote.expiryDate
                  ).toLocaleString()}, the total cost will be US$${quote.cost}`
                : null}
            </p>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default RequestForm;

{
  /* optionEndDate */
}
{
  <Form.Group className="mb-3" as={Col} md="12" controlId="optionEndDate">
    <Form.Label className={styles["form-label"]}>Option End Date</Form.Label>
    <InputGroup hasValidation>
      <Form.Control
        className={styles["optionEndDate"]}
        name="optionEndDate"
        as="input"
        required={true}
        type="date"
        value={formObj.optionEndDate.substring(0, 10)}
        min={formObjInit.optionEndDate.substring(0, 10)}
        max={
          parseInt(formObjInit.optionEndDate.substring(0, 4)) +
          4 +
          formObjInit.optionEndDate.substring(4, 10)
        }
        onBlur={(e) => {
          setErrors(handleError({ optionEndDate: e.target.value }));
          if (!Object.keys(errors).includes("optionEndDate")) {
            let dayDiff = Math.ceil(
              (new Date(e.target.value) - new Date()) / (1000 * 60 * 60 * 24)
            );
            setFormObj({
              ...formObj,
              expiryDate: dayDiff,
            });
          }
        }}
        onChange={(e) => {
          setErrors(handleError({ optionEndDate: e.target.value }));
          if (!Object.keys(errors).includes("optionEndDate")) {
            let newDate = new Date();
            newDate.setDate(
              newDate.getDate() + Math.round(parseInt(e.target.value))
            );
            setFormObj({
              ...formObj,
              optionEndDate: new Date(e.target.value).toISOString(),
            });
          }
        }}
        isInvalid={Object.keys(errors).includes("optionEndDate")}
      ></Form.Control>
      <InputGroup.Text
        className={styles["input-group"]}
        id={styles["inputGroupTimeZone"]}
      >
        {`0:00AM ${new Date(formObj.optionEndDate).toString().substring(25)}`}
      </InputGroup.Text>
      <Form.Control.Feedback type="invalid">
        {errors.optionEndDate}
      </Form.Control.Feedback>
    </InputGroup>
  </Form.Group>;
}
