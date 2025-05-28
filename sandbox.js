// const { User } = require("../models");
// const { signToken } = require("../helpers/jwt");
// const { comparePassword } = require("../helpers/bcrypt");

// const { OAuth2Client } = require("google-auth-library");

// const client = new OAuth2Client();

// module.exports = class MovieController {
//   static async googleLogin(req, res, next) {
//     try {
//       const { id_token } = req.body;
//       const ticket = await client.verifyIdToken({
//         idToken: id_token,
//         audience: 
//           "656049011535-oht6cgegs4oe6.apps.googleusercontent.com",
//       });
//       const payload = ticket.getPayload();
//       const user = await User.findOne({ where: { email: payload.email } });

//       if (!user) {
//         const newUser = await User.create({
//           name: payload.name,
//           email: payload.email,
//           // Use a random password for new users
//           // or we could deactive hash password
//           password: Math.random().toString(36).slice(-8), // Random password for new users
//         });
//         const access_token = signToken({ id: newUser.id });
//         return res.status(201).json({ access_token });
//       }

//       const access_token = signToken({ id: user.id });
//       res.status(200).json({ access_token });
//     } catch (err) {
//       next(err);
//     }
//   }
// };




// import { useEffect, useState } from "react";
// import { serverApi } from "../utils/api";
// import { useNavigate } from "react-router";
// import { errorAlert, successToast } from "../utils/sweetAlert";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleOnChange = (e) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleOnSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const { data } = await serverApi.post("/login", form);
//       localStorage.setItem("access_token", data.access_token);
//       successToast("Login success");
//       navigate("/");
//     } catch (err) {
//       errorAlert(err.response.data.message);
//     }
//   };

//   useEffect(() => {
//     async function handleCredentialResponse(response) {
//       console.log("Encoded JWT ID token: " + response.credential);

//       const { data } = await serverApi.post("/login/google", {
//         id_token: response.credential,
//       });

//       localStorage.setItem("access_token", data.access_token);
//       successToast("Login success");
//       navigate("/");
//     }

//     window.google.accounts.id.initialize({
//       client_id:
//         "656049011535-oht6cgegs4oqvvd6oeq56m6a4gtt4je6.apps.googleusercontent.com",
//       callback: handleCredentialResponse,
//     });
//     window.google.accounts.id.renderButton(
//       document.getElementById("buttonDiv"),
//       { theme: "outline", size: "large" } // customization attributes
//     );
//     window.google.accounts.id.prompt(); // also display the One Tap dialog
//   }, []);

//   return (
//     <section id="login-page">
//       <div className="container-sm py-5">
//         <h3 className="text-center">Welcome To MyMovieList</h3>
//         <form className="w-50 mx-auto py-5" onSubmit={handleOnSubmit}>
//           <div className="mb-3">
//             <label htmlFor="login-email" className="form-label">
//               Email address
//             </label>
//             <input
//               type="email"
//               className="form-control"
//               id="login-email"
//               aria-describedby="emailHelp"
//               autoComplete="email"
//               value={form.email}
//               name="email"
//               onChange={handleOnChange}
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="login-password" className="form-label">
//               Password
//             </label>
//             <input
//               type="password"
//               className="form-control"
//               id="login-password"
//               autoComplete="current-password"
//               value={form.password}
//               name="password"
//               onChange={handleOnChange}
//             />
//           </div>
//           <div className="d-flex justify-content-center">
//             <button type="submit" className="btn btn-primary px-3">
//               Login
//             </button>
//           </div>
//         </form>
//         <div id="buttonDiv"></div>
//       </div>
//     </section>
//   );
// }