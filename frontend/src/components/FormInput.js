import { Form, Col, InputGroup } from "react-bootstrap";
import styles from "./RequestForm.module.sass";
import DatePicker from "react-datepicker";

const ConditionalWrap = ({ condition, wrap, children }) =>
  condition ? wrap(children) : children;
const FormInput = ({
  md = 12,
  controlId,
  labelText,
  labelStyle,
  labelClass,
  labelId,
  inputGroupText,
  inputGroupStyle,
  inputGroupClass,
  inputGroupId,
  name,
  as = "input",
  required = true,
  type = "text",
  className,
  step,
  value,
  isInvalid,
  onBlur,
  onChange,
  optionArr,
  isFeedBack = true,
  errors,
  min,
  max,
  isDatePicker,
}) => {
  return (
    <Form.Group className="mb-3" as={Col} md={md} controlId={controlId}>
      {labelText && (
        <Form.Label
          style={labelStyle}
          className={`${styles["form-label"]} ${styles[{ labelClass }]}`}
        >
          {labelText}
        </Form.Label>
      )}
      {/* conditional wrapper if input group needed */}
      <ConditionalWrap
        condition={inputGroupText}
        wrap={(children) => <InputGroup> {children}</InputGroup>}
      >
        {isDatePicker ? (
          <DatePicker
            className={className}
            selected={value}
            minDate={min}
            maxDate={max}
            ariaRequired={required}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={isInvalid}
            wrapperClassName={className}
          />
        ) : (
          <Form.Control
            className={className}
            name={name}
            as={as}
            required={required}
            type={type}
            step={step}
            value={value}
            isInvalid={isInvalid}
            onBlur={onBlur}
            onChange={onChange}
            min={min}
            max={max}
          >
            {as === "select"
              ? optionArr.map((element) => {
                  return (
                    <option
                      className={styles["select-option"]}
                      value={element.value}
                    >
                      {element.html}
                    </option>
                  );
                })
              : null}
          </Form.Control>
        )}

        {inputGroupText && (
          <InputGroup.Text
            className={`${styles["input-group"]} ${
              styles[{ inputGroupClass }]
            }`}
            style={inputGroupStyle}
            id={styles[inputGroupId]}
          >
            {inputGroupText}
          </InputGroup.Text>
        )}
        {isFeedBack && (
          <Form.Control.Feedback type="invalid">{errors}</Form.Control.Feedback>
        )}
      </ConditionalWrap>
    </Form.Group>
  );
};
export default FormInput;
