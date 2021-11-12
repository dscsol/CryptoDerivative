import { useSelector } from "react-redux";

const FormSuccess = () => {
  const form = useSelector((state) => state.quoteForm);
  console.log(form);
  return (
    <div>
      {Object.keys(form).map((name) => {
        console.log(name);
        return (
          <p>
            {name}: {form[name]}
          </p>
        );
      })}
    </div>
  );
};

export default FormSuccess;
