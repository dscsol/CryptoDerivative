export default function validate({ values, price }) {
  // console.log(price.minQty, price.maxQty);
  let errors = {};
  if (!values.underlying || values.underlying === "") {
    errors.underlying = "Asset type is required";
  }
  if (!values.quantity || values.quantity === "") {
    errors.quantity = "Quantity is required";
  }
  // else if (values.quantity < price.minQty) {
  //   errors.quantity = `Quantity must more than ${price.minQty}`;
  // } else if (values.quantity > price.maxQty) {
  //   errors.quantity = `Quantity must less than ${price.maxQty}`;
  // }
  if (!values.period || values.period === "") {
    errors.period = "Period is require";
  } else if (values.period < 1) {
    errors.period = "Period must more than 1 day";
  } else if (values.period % 1 > 0) {
    errors.period = "Period must not have decimal";
  } else if (values.period > 365) {
    errors.period = "Maximum period is 1 year";
  }
  return errors;
}
