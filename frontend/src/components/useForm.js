import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { changeFormQuote } from "../redux/quoteFormSlice";

const useForm = (submitForm, validate) => {
  const form = useSelector((state) => state.quoteForm);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    dispatch(changeFormQuote({ [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(form));
    setIsSubmit(true);
  };
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmit) {
      submitForm();
      console.log("success");
    }
  }, [errors]);

  return { handleChange, handleSubmit, errors };
};

export default useForm;
