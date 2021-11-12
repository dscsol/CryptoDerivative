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
    if (name == "period") {
      addDateToISO({ period: value });
    }
  };
  const handleSubmit = async (e) => {
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
      console.log(e);
    }
  };
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmit) {
      addDateToISO({ period: form.period });
      submitForm();
      console.log("success");
    }
  }, [errors]);

  return { handleChange, handleSubmit, addDateToISO, errors };
};

export default useForm;
