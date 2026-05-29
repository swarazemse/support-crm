import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "loggedIn",
        "true"
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      navigate("/");

    } catch (error) {
       console.log(error);

        if (!error.response) {
          setError("Server is waking up. Please try again in 10 seconds.");
        } else {
          setError("Invalid credentials");
        }
      }
  };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">

      <form
        onSubmit={handleLogin}
        className="
          bg-white
          p-10
          rounded-lg
          shadow-lg
          w-full
          max-w-md
        "
      >

        <h1 className="
          text-3xl
          font-bold
          mb-8
          text-center
        ">
          Support CRM Login
        </h1>

        {error && (

          <div className="
            bg-red-100
            text-red-700
            p-3
            rounded
            mb-4
          ">
            {error}
          </div>
        )}

        <div className="mb-4">

          <label className="
            block
            mb-2
            font-semibold
          ">
            Username
          </label>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="
              w-full
              border
              p-3
              rounded
            "
            required
          />

        </div>

        <div className="mb-6">

          <label className="
            block
            mb-2
            font-semibold
          ">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="
              w-full
              border
              p-3
              rounded
            "
            required
          />

        </div>

        <button
          type="submit"
          className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded
            hover:bg-blue-700
          "
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;