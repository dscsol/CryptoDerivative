export default function validate(values) {
  let errors = {};
  if (!values.underlying || values.underlying == "") {
    errors.underlying = "Asset type is required";
  }
  if (!values.quantity || values.quantity == "") {
    errors.quantity = "Quantity is required";
  } else if (values.quantity < 0.001) {
    errors.quantity = "Quantity must more than 0.001";
  }
  if (!values.period || values.period == "") {
    errors.period = "Period is require";
  } else if (values.period < 1) {
    errors.period = "Period must more than 1 day";
  } else if (values.period % 1 < 0) {
    errors.period = "Period must not have decimal";
  }
  return errors;
}
