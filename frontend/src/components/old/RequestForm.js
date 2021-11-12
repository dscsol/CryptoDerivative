// import styles from "./RequestForm.module.sass";
// import { Form, Col, Row, Button, Container, InputGroup } from "react-bootstrap";
// import { useState } from "react";
// import axios from "redaxios";
// import FormInput from "./FormInput";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   changeUnderlying,
//   changeQuantity,
//   changeExpiryDate,
//   changeOptionEndDate,
// } from "../redux/quoteFormSlice";
// import { DateTime } from "luxon";

// const RequestForm = () => {
//   const dt = DateTime.now();
//   const form = useSelector((state) => state.quoteForm);
//   const formInit = form;
//   const dispatch = useDispatch();
//   // set all selectbox option value
//   const arrCryptoType = [
//     {
//       value: "BTC",
//       html: "BTC",
//     },
//     { value: "ETH", html: "ETH" },
//   ];
//   const arrOptionType = [
//     {
//       value: "call",
//       html: "Call",
//     },
//     // {
//     //   value: "put",
//     //   html: "Put",
//     // },
//   ];
//   const arrOptionSide = [{ value: "buy", html: "Buy" }];

//   const isLeapYear = (year) => {
//     return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
//   };

//   // set all var state
//   const [validated, setValidated] = useState(false);
//   const [isSubmitDisable, setIsSubmitDisable] = useState(false);
//   const [errors, setErrors] = useState({});

//   const [quote, setQuote] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // console.log(formInit);
//     if (Object.keys(errors).length == 0) {
//       setValidated(true);
//       console.log(form);

//       // let cost = await axios.post(`${process.env.REACT_APP_SERVER}/quote`, {
//       //   form,
//       // });

//       // setQuote(cost.data);

//       // reset formObj to default
//       // dispatch(formInit);
//       setValidated(false);
//     }
//   };

//   // input validation, return as obj
//   const handleError = (obj) => {
//     let newErrors = {};
//     Object.keys(obj).map((name) => {
//       switch (name) {
//         case "underlying":
//           if (!obj[name] || obj[name] == "") {
//             newErrors[name] = "Please choose an asset.";
//           }
//           break;
//         case "quantity":
//           if (!obj[name] || obj[name] == "") {
//             newErrors[name] = "Amount cannot be empty.";
//           } else if (obj[name] < 0.001) {
//             newErrors[name] = "Amount cannot be smaller than 0.001.";
//           }
//           break;
//         case "expiryDate":
//           if (!obj[name] || obj[name] == "") {
//             newErrors[name] = "Period cannot be empty.";
//           } else if (obj[name] < 1) {
//             newErrors[name] = "Minimum period is 1 day.";
//           } else if (obj[name] > dt.plus({ years: 1 }).diff(dt, "days").days) {
//             newErrors[name] = "Maximum period is 1 year.";
//           }
//         // handle by DateTime
//         case "optionEndDate":
//           if (!obj[name] || obj[name] == "") {
//             newErrors[name] = "Period cannot be empty.";
//           }
//           break;
//       }
//     });
//     setErrors(newErrors);
//   };

//   return (
//     <div className={styles.FormQuote}>
//       <div className={styles.color}>
//         <Container className={styles.container}>
//           <Form noValidate validated={validated} onSubmit={handleSubmit}>
//             <Row>
//               {/* underlying component w/ redux */}
//               <FormInput
//                 as="select"
//                 controlId="underlying"
//                 labelText="What asset do you hold?"
//                 name="underlying"
//                 type="text"
//                 value={form.underlying}
//                 isInvalid={Object.keys(errors).includes("underlying")}
//                 onBlur={(e) => {
//                   setErrors(handleError({ underlying: e.target.value }));
//                 }}
//                 onChange={(e) => {
//                   dispatch(changeUnderlying(e.target.value));
//                 }}
//                 isFeedBack={true}
//                 optionArr={arrCryptoType}
//                 errors={errors.underlying}
//               />
//               {/* quantity component w/ redux */}
//               <FormInput
//                 controlId="quantity"
//                 labelText="How much do you hold?"
//                 inputGroupText={form.underlying.toUpperCase()}
//                 inputGroupId={styles["inputGroupCrypto"]}
//                 name="quantity"
//                 type="number"
//                 step="any"
//                 value={form.quantity}
//                 isInvalid={Object.keys(errors).includes("quantity")}
//                 onBlur={(e) => {
//                   setErrors(handleError({ quantity: e.target.value }));
//                 }}
//                 onChange={(e) => {
//                   dispatch(changeQuantity(e.target.value));
//                 }}
//                 isFeedBack={true}
//                 errors={errors.quantity}
//               />
//               {/* expiryDate component w/ redux */}
//               <FormInput
//                 controlId="expiryDate"
//                 labelText="How long do you want to protect your asset?"
//                 inputGroupText={`Day${form.expiryDate > 1 ? "s" : ""}`}
//                 inputGroupId="inputGroupDay"
//                 name="expiryDate"
//                 type="number"
//                 value={form.expiryDate}
//                 isInvalid={Object.keys(errors).includes("expiryDate")}
//                 onBlur={(e) => {
//                   if (!Object.keys(errors).includes("expiryDate")) {
//                     let newDate = new Date();
//                     newDate.setDate(
//                       newDate.getDate() + Math.round(parseInt(e.target.value))
//                     );
//                     // dispatch(changeOptionEndDate(newDate.toISOString()));
//                   }
//                 }}
//                 onChange={(e) => {
//                   setErrors(handleError({ expiryDate: form.expiryDate }));
//                   dispatch(
//                     changeExpiryDate(Math.round(parseInt(e.target.value)))
//                   );
//                 }}
//                 isFeedBack={true}
//                 errors={errors.expiryDate}
//               />
//               {/* calendar */}
//               {/* <Row>
//                 <FormInput
//                   isDatePicker={true}
//                   controlId="optionEndDate"
//                   labelText="Option End Date"
//                   value={new Date(form.optionEndDate)}
//                   min={new Date(dt.plus({ days: 1 }))}
//                   max={new Date(dt.plus({ years: 1 }))}
//                   className={styles["optionEndDateDatePicker"]}
//                   required={true}
//                   onChange={async (e) => {
//                     console.log(e);
//                     let err = handleError({ optionEndDate: e });
//                     setErrors(err);
//                     console.log(errors);
//                     if (!Object.keys(errors).includes("optionEndDate")) {
//                       const diff = Math.ceil(
//                         DateTime.fromISO(e.toISOString()).diff(dt, "days").days
//                       );
//                       dispatch(changeOptionEndDate(e.toISOString()));
//                       dispatch(changeExpiryDate(diff));
//                     }
//                   }}
//                   onBlur={(e) => {
//                     if (!Object.keys(errors).includes("optionEndDate")) {
//                       dispatch(changeOptionEndDate(e.toISOString()));
//                       dispatch(changeExpiryDate(diff));
//                     }
//                   }}
//                   isInvalid={Object.keys(errors).includes("optionEndDate")}
//                   inputGroupText={`${new Date(form.optionEndDate)
//                     .toString()
//                     .substring(19)}`}
//                   isFeedBack={true}
//                   errors={errors.optionEndDate}
//                 />
//               </Row> */}
//               {/* submit button */}
//               <div className=" mb-3 d-grid gap-2">
//                 <Button
//                   disabled={isSubmitDisable}
//                   id="btnQuote"
//                   variant="primary"
//                   size="md"
//                   type="submit"
//                 >
//                   QUOTE
//                 </Button>
//               </div>
//             </Row>

//             <p>
//               {quote
//                 ? `Your asset will be protected until ${new Date(
//                     quote.expiryDate
//                   ).toLocaleString()}, the total cost will be US$${quote.cost}`
//                 : null}
//             </p>
//           </Form>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default RequestForm;
