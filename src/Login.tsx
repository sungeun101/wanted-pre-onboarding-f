import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [token, setToken] = useState<null | string>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", email);
    }
  }, [token, email]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/todo", { replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setLoading(true);
      const res: any = await axios.post(
        "https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/auth/signup",
        { email, password }
      );
      if (res.data.access_token) {
        setToken(res.data.access_token);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("400")) {
        handleSignIn();
      }
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res: any = await axios.post(
        "https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/auth/signin",
        { email, password }
      );
      if (res.data.access_token) {
        setToken(res.data.access_token);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("에러가 발생했습니다.");
      }
    }
    setLoading(false);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setEmail(value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setPassword(value);
  };

  const validateForm = () => {
    if (password.length >= 8 && email.includes("@")) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  };

  return (
    <div className="flex justify-center items-center bg-slate-100 h-screen">
      <form
        onSubmit={handleSignUp}
        method="POST"
        id="login-form"
        className="border-1 p-10 flex flex-col gap-2 bg-white rounded-md"
      >
        <h1 className="mx-auto mb-4">To-do App</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          type="submit"
          disabled={submitDisabled}
          className="bg-blue-200 rounded-sm mt-4"
        >
          {loading ? <LoadingOutlined /> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
