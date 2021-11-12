import React from "react";
import { useSelector } from "react-redux";
import { Form, Button, InputGroup } from "react-bootstrap";
// import { DateTime } from "luxon";
import validate from "./validate";

import useForm from "./useForm";

const FormQuote = ({ submitForm }) => {
  // init
  // const dt = DateTime.now();
  const form = useSelector((state) => state.quoteForm);

  const { handleChange, handleSubmit, errors } = useForm(submitForm, validate);

  return (
    <Form onSubmit={handleSubmit}>
      {/* underlying */}
      <Form.Group>
        <Form.Label>What asset do you own?</Form.Label>
        <Form.Control
          name="underlying"
          as="select"
          type="text"
          onChange={handleChange}
          isInvalid={Object.keys(errors).includes("underlying")}
          required
        >
          <option>BTC</option>
          <option>ETH</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.underlying}
        </Form.Control.Feedback>
      </Form.Group>
      {/* quantity */}
      <Form.Group>
        <Form.Label>How much do you hold?</Form.Label>
        <InputGroup>
          <Form.Control
            name="quantity"
            type="number"
            step="any"
            value={form.quantity}
            onChange={handleChange}
            isInvalid={Object.keys(errors).includes("quantity")}
            required
          />
          <InputGroup.Text>{form.underlying}</InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            {errors.quantity}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      {/* period */}
      <Form.Group>
        <Form.Label>How long do you want to protect your asset?</Form.Label>
        <InputGroup>
          <Form.Control
            name="period"
            type="number"
            value={form.period}
            onChange={handleChange}
            isInvalid={Object.keys(errors).includes("period")}
            required
          />
          <InputGroup.Text>Day(s)</InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            {errors.period}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      {/* endDate */}
      <p>{new Date(form.endDate).toString()}</p>

      {/* submit button */}
      <div className=" mb-3 d-grid gap-2">
        <Button type="submit" size="md">
          GET QUOTE
        </Button>
      </div>
    </Form>
  );
};

export default FormQuote;
