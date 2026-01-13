import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import z from "zod";
import { loginSuccess } from "../store/userSlice";
import ErrorCodes from "../services/error-codes";
import Form from "../components/Form";
import "./Login.css";

const loginSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z.string().min(1, { error: "password is required" }),
});

function Login() {
  const fields = [
    {
      name: "email",
      type: "email",
      defaultValue: "",
      placeholder: "Enter your email",
      required: true,
    },
    {
      name: "password",
      type: "password",
      defaultValue: "",
      placeholder: "Enter your password",
      required: true,
    },
  ];

  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSuccess(data) {
    dispatch(loginSuccess(data));
    navigate("/");
  }

  function handleError(code, error) {
    console.log(code, error);
    if (code === ErrorCodes.NOT_FOUND || ErrorCodes.INVALID_CREDENTIALS) {
      setError(error);
    } else {
      setError(null);
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>

      <Form
        fields={fields}
        schema={loginSchema}
        submitPath="/auth/login"
        onSuccess={handleSuccess}
        onError={handleError}
        submitButtonTitle="Login"
      />

      {error && <div className="login-error">{error}</div>}

      <div>
        Don't have an account?{" "}
        <Link to="/register" className="login-register">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
