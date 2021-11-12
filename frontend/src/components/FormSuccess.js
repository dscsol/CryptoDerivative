import { useSelector } from "react-redux";

const FormSuccess = () => {
  const form = useSelector((state) => state.quoteForm);
  console.log(form);
  return (
    <div>
      {Object.keys(form).map((name) => {
        return name !== "endDate" ? (
          <p>{`${name}: ${form[name]}`}</p>
        ) : (
          <p>{`${name}: ${new Date(form[name]).toString()}`}</p>
        );
      })}
    </div>
  );
};

export default FormSuccess;
