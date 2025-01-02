// SigninForm

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService"; // import the authservice

const SigninForm = (props) => {
  const navigate = useNavigate(); // added this for navigation purposes
  const [message, setMessage] = useState([""]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signin(formData); // TODO build signin service function

      props.setUser(user);
      navigate("/");
    } catch (err) {
      updateMessage(err.message);
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-100 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          sign In
        </h1>
        <p className="text-red-500 text-center mb-4">{message}</p>
        <form autoComplete="off" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Username:
            </label>
            <input
              type="text"
              autoComplete="off"
              id="username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-900 disabled:bg-gray-400"
            >
              Sign In
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/">
              <button
                type="button"
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SigninForm;
