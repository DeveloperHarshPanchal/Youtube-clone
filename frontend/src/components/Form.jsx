import { useMemo, useState } from "react";
import z from "zod";
import api from "../services/api";
import ErrorCodes from "../services/error-codes";
import Button from "./Button";
import FormField from "./FormField";
import toast from "react-hot-toast";
import "./Form.css";

function Form({
  fields,
  schema,
  submitPath,
  onSuccess,
  onError,
  submitButtonTitle,
  submitButtonIcon,
  disableSubmit,
  dialog = false,
  method = "post",
}) {
  const defaultFormValues = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, f.defaultValue])),
    [fields]
  );

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [formErrors, setFormErrors] = useState({});

  function handleChange(name, value) {
    onError(null, null);
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const result = schema.safeParse(formValues);
    if (!result.success) {
      const error = z.treeifyError(result.error);
      setFormErrors(error.properties ?? {});
      return;
    }

    try {
      const response = await api[method](submitPath, result.data);
      onSuccess(response.data.data);
      toast.success(response.data.message);
    } catch (err) {
      if (err.response) {
        const { code, error } = err.response.data;

        if (code === ErrorCodes.VALIDATION_ERROR) {
          setFormErrors(err.response.data.errors);
          return;
        }
        onError(code, error);
      } else {
        onError(ErrorCodes.NETWORK_ERROR, err.message);
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      method={dialog ? "dialog" : "post"}
      className="form"
    >
      {fields.map(({ name, type, onInput, placeholder, required }) => (
        <FormField
          key={name}
          name={name}
          type={type}
          value={formValues[name]}
          onChange={handleChange}
          errors={formErrors[name]?.errors}
          onInput={onInput}
          placeholder={placeholder}
          required={required}
        />
      ))}

      <Button
        type="submit"
        disabled={disableSubmit}
        title={submitButtonTitle}
        Icon={submitButtonIcon}
        className="form-submit"
      />
    </form>
  );
}

export default Form;
