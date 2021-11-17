import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeQuoteForm } from "../redux/quoteFormSlice";
import { changeQuotePrice } from "../redux/quotePriceSlice";
import { changeStatus } from "../redux/statusSlice";
import { DateTime } from "luxon";
import axios from "redaxios";
import { useHistory } from "react-router-dom";

// custom hook for form handling
const useForm = ({ validate }) => {
  let history = useHistory();
  const form = useSelector((state) => state.quoteForm);
  const price = useSelector((state) => state.quotePrice);
  const status = useSelector((state) => state.status);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // take period and dispatch endDate
  const addDateToISO = ({ dt = DateTime.now(), period }) => {
    try {
      let newDate = dt.plus({ days: period });
      dispatch(
        changeQuoteForm({ endDate: new Date(newDate.toUTC()).toISOString() })
      );
    } catch (e) {
      console.error(e);
    }
  };

  // hanle changes to redux
  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    dispatch(changeQuoteForm({ [name]: value }));
    if (name === "period") {
      addDateToISO({ period: value });
    }
  };

  // set errors to input and is submit when submit is click
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(form));
    setIsSubmit(true);
  };

  // axios get quote from Binance
  // sent loading and error to Form.js
  const axiosQuote = async () => {
    dispatch(changeStatus({ isLoading: true }));
    await axios
      .post(`${process.env.REACT_APP_SERVER}/quote`, {
        underlying: form.underlying,
        quantity: form.quantity,
        expiryDate: new Date(form.endDate).getTime(),
      })
      .then((res) => {
        dispatch(changeStatus({ isLoading: false }));
        dispatch(changeQuotePrice(res.data));
      })
      .catch((err) => {
        dispatch(changeStatus({ error: `${err.status} ${err.statusText}` }));
      });
  };

  // listen input errors, if no errors then submit
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmit) {
      addDateToISO({ period: form.period });
      dispatch(changeStatus({ isSubmit: true }));
      axiosQuote();
      history.push("/order");
    }
  }, [errors]);

  return { handleChange, handleSubmit, addDateToISO, errors };
};

export default useForm;
