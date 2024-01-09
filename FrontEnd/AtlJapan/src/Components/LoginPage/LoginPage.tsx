import "./LoginPage.css";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const schema = Yup.object().shape({
  email: Yup.string()
    .required("Email is a required field")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is a required field")
    .min(6, "Password must be at least 6 characters"),
});

function App() {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <Navbar />
      <Formik
        validationSchema={schema}
        initialValues={{ email: "", password: "" }}
        //   onSubmit={async (values) => {
        //     try {
        //       const response = await axios.post(
        //         "http://localhost:5291/api/Login",
        //         {
        //           username: values.email,
        //           password: values.password,
        //         }
        //       );
        //       const token = response.data.token;
        //       const nameuser = response.data.name;
        //       localStorage.setItem("Name", nameuser);
        //       navigate("/dashboard");
        //     } catch (error) {
        //       console.error("Login failed:", error);
        //       alert("Login Failed, Invalid User");
        //     }
        //   }}
        // >

        onSubmit={async (values) => {
          // Alert the input values of the form that we filled
          // alert(JSON.stringify(values));
          try {
            const response = await axios.post(
              // "http://localhost:5291/api/Login",
              `${BASE_URL}/api/Login`,
              {
                username: values.email,
                password: values.password,
              }
            );
            const token = response.data.token;
            console.log(response.data);
            const nameuser = response.data.name;
            const Email = response.data.username;
            localStorage.setItem("Name", nameuser);
            localStorage.setItem("Username", Email);
            // alert(token);
            navigate("/dashboard");
            // Store the token in local storage or cookies for authentication.
          } catch (error) {
            console.error("Login failed:", error);
            alert("Login Failed, Invalid User or Wrong Password");
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="login">
            <div className="form">
              <form noValidate onSubmit={handleSubmit}>
                <span>Login</span>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder="Enter email id / username"
                  className="form-control inp_text"
                  id="email"
                />
                <p className="error">
                  {errors.email && touched.email && errors.email}
                </p>
                <div className="password-input">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder="Enter password"
                    className="form-control"
                  />

                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="eye-icon"
                    style={{
                      fontSize: "10px",
                      width: "40px",
                      height: "50px",
                      alignItems: "center",
                      paddingLeft: "15px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEye : faEyeSlash}
                      style={{ alignContent: "center" }}
                    />
                  </button>
                </div>
                <p className="error">
                  {errors.password && touched.password && errors.password}
                </p>
                <br></br>
                <button type="submit">Login</button>
              </form>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
}

export default App;
