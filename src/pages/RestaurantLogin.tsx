import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
// import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";

// const Toast = Swal.mixin({
//   toast: true,
//   position: 'top-right',
//   iconColor: 'white',
//   customClass: {
//     popup: 'colored-toast',
//   },
//   showConfirmButton: false,
//   timer: 1500,
//   timerProgressBar: true,
// });

interface SliderSettings {
  slidesToShow: number;
  slidesToScroll: number;
  infinite: boolean;
  autoplay: boolean;
  autoplaySpeed: number;
  arrows: boolean;
  dots: boolean;
}

const RestaurantLogin: React.FC = () => {
  const sliderSettings: SliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    dots: false,
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const CheckLogin = async (): Promise<void> => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/restaurant/login`;
      const response = await axios.post(
        apiUrl,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.status === 1) {
        const token = response.data.data.Token;
        localStorage.setItem("authToken", token);
        // window.location.href = "/Restaurant/Dashboard";
        navigate("/Restaurant/Dashboard");
        // Show success toast
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        // Show error toast for failed login
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (err) {
      // Show error toast for invalid credentials
      toast.error("Invalid email or password.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    CheckLogin();
  };

  return (
    <div className="login_wrap sm:h-screen sm:flex sm:overflow-hidden">
      <div className="container-fluid p-0">
        <div className="wraps-center row flex-xl-row flex-lg-row flex-md-row flex-sm-row flex-column-reverse">
          <div className="col-md-6 col-lg-6 col-sm-6 col-12 px-0">
            <div className="login_wraps-form ">
              <span>
                <img
                  src="../../Content/SuperAdmin/images/logo-new.png"
                  alt="logo"
                  className="main-logo w-36"
                />
              </span>
              <h1 className="text-center">Sign In</h1>

              <form className="form_login" onSubmit={handleSubmit}>
                <div className="form-group form_login-inpts">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control text_wraps-input"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="youremail@gmail.com"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group form_login-inpts mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className="form-control text_wraps-input"
                    placeholder="Password"
                  />
                </div>

                <div className="form-group">
                  <div className="sb-checkbox">
                    <label className="form-check-label">
                      <Link to="/forgot-password">
                        <span className="wrap-remember">Forgot Password?</span>
                      </Link>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary wrap_submit-signin"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>

          <div className="-translate-y-0.5 sm:min-h-screen col-md-6 col-lg-6 col-sm-6 col-12 px-0" style={{ padding: 0 }}>
            <div className="carousel">
              <Slider {...sliderSettings}>
                <div>
                  <img
                    src="../../Content/SuperAdmin/images/loginwrap.jpg"
                    alt="login-image"
                    className="h-full login_image object-stretch"
                  />
                </div>
                <div>
                  <img
                    src="../../Content/SuperAdmin/images/firstraps.jpg"
                    alt="login-image"
                    className="h-full login_image object-stretch"
                  />
                </div>
                <div>
                  <img
                    src="../../Content/SuperAdmin/images/firstraps.jpg"
                    alt="login-image"
                    className="h-full login_image object-stretch"
                  />
                </div>
                <div>
                  <img
                    src="../../Content/SuperAdmin/images/loginwrap.jpg"
                    alt="login-image"
                    className="h-full login_image object-stretch"
                  />
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;
