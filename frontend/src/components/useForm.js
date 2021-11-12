import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { changeFormQuote } from "../redux/quoteFormSlice";
import { DateTime } from "luxon";
import axios from "redaxios";

const useForm = (submitForm, validate) => {
  const form = useSelector((state) => state.quoteForm);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    dispatch(changeFormQuote({ [name]: value }));
    if (name === "period") {
      addDateToISO({ period: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(form));
    setIsSubmit(true);
  };

  const addDateToISO = ({ dt = DateTime.now(), period }) => {
    try {
      let newDate = dt.plus({ days: period });
      dispatch(
        changeFormQuote({ endDate: new Date(newDate.toUTC()).toISOString() })
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(async () => {
    if (Object.keys(errors).length === 0 && isSubmit) {
      addDateToISO({ period: form.period });
      submitForm();
      console.log("success");
      // console.log(`${process.env.REACT_APP_SERVER}/quote`);
      // let cost = await axios.post(`${process.env.REACT_APP_SERVER}/quote`, {
      //   underlying: form.underlying,
      //   quantity: form.quantity,
      //   expiryDate: form.endDate,
      // });
      // console.log("cost: ", cost);
      axiosQuote();
    }
  }, [errors]);

  const axiosQuote = async () => {
    axios.defaults.baseURL = process.env.REACT_APP_SERVER;
    let cost = await axios.post(`${process.env.REACT_APP_SERVER}/quote`, {
      underlying: form.underlying,
      quantity: form.quantity,
      expiryDate: form.endDate,
    });
    console.log(cost);
  };

  return { handleChange, handleSubmit, addDateToISO, errors };
};

export default useForm;
