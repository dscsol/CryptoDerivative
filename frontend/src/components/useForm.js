import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeQuoteForm } from "../redux/quoteFormSlice";
import { DateTime } from "luxon";
import axios from "redaxios";

// custom hook for form handling
const useForm = ({ formSubmit, formLoading, formError, validate }) => {
  const form = useSelector((state) => state.quoteForm);
  const price = useSelector((state) => state.quotePrice);
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

  // set errors and is submit when submit is click
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(form));
    setIsSubmit(true);
  };

  // axios get quote from Binance
  const axiosQuote = async () => {
    formLoading(true);
    await axios
      .post(`${process.env.REACT_APP_SERVER}/quote`, {
        underlying: form.underlying,
        quantity: form.quantity,
        expiryDate: new Date(form.endDate).getTime(),
      })
      .then((res) => {
        formLoading(false);
        dispatch(changeQuotePrice(res.data));
      })
      .catch((err) => {
        formError(`${err.status} ${err.statusText}`);
      });
  };

  // listen Errors, if no errors then submit
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmit) {
      addDateToISO({ period: form.period });
      formSubmit(true);
      console.log("success");
      axiosQuote();
      console.log("hello");
    }
  }, [errors]);

  return { handleChange, handleSubmit, addDateToISO, errors };
};

export default useForm;
