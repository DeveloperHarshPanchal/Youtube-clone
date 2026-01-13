import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import "./FormField.css";

function FormField({
  name,
  type,
  value,
  onChange,
  errors,
  placeholder,
  required,
  onInput = () => {},
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-field-label">
        {name}
        {!required && <span className="form-field-optional">(optional)</span>}
      </label>

      <div className="form-field-input-row">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(evt) => onChange(name, evt.target.value)}
          onInput={onInput}
          autoComplete="off"
          className="form-field-input"
        />

        {type === "password" && (
          <button
            type="button"
            className="form-field-toggle"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
        )}
      </div>

      {errors && (
        <div className="form-field-error">
          {errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormField;
