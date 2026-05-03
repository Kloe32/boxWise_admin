import React, { useState, useEffect } from "react";
import logo from "/logo.png";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import axiosInstance from "../config/axiosInstance";
import { API_ROUTES, STORAGE_KEY } from "../config/config";
import { useUser } from "../contexts/UserContext";
import { storeItemToLocalStorage } from "../helper/helper";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUserData } = useUser();

  const navigate = useNavigate();
  const emailRegX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Demo-only validation
    const okEmail = emailRegX.test(email.trim());
    if (!okEmail) return setError("Please enter a valid email address.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");

    try {
      setLoading(true);
      const response = await axiosInstance.post(API_ROUTES.LOGIN_URL, {
        email,
        password,
      });
      console.log(response.data.data);
      if (response?.data?.data?.user?.role !== "ADMIN") {
        return setError("Sorry, you are not authorized to use this service.");
      }
      if (response?.data?.success) {
        setUserData(response?.data?.data?.user);
        storeItemToLocalStorage(STORAGE_KEY.TOKEN, response?.data?.data?.token);
        storeItemToLocalStorage(
          STORAGE_KEY.USER_DATA,
          response?.data?.data?.user,
        );
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.log("Error Logging In:", err);
      setError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-starblack/90 text-slate-100 font-roboto ">
      {/*---------------- Background ----------------*/}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-55 -right-30 h-130 w-130 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_50%)]" />
      </div>

      {/* ---------------- Content ----------------*/}
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {/* ---------------- Left: Branding / Info ----------------*/}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="inline-flex items-center gap-3">
              <div className="p-3 w-18 bg-primary/80 rounded-full">
                <img src={logo} alt="" />
              </div>
              <div className="leading-tight">
                <div className="text-xl font-semibold tracking-tight">
                  BoxWise
                </div>
                <div className="text-sm text-slate-300/80">Admin Portal</div>
              </div>
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight">
              Manage units, bookings, and payments{" "}
              <span className="bg-linear-to-r from-primary via-pink-300 to-slate-300 bg-clip-text text-transparent">
                in one place.
              </span>
            </h1>

            <p className="mt-4 max-w-md text-slate-300/80">
              Secure access for authorized staff. Verify transactions, confirm
              reservations, and monitor occupancy with confidence.
            </p>
          </div>

          {/* ---------------- Right: Login Card ----------------*/}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/20 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* Mobile brand */}
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <div className="p-2 w-13 bg-primary/80 rounded-full">
                  <img src={logo} alt="" />
                </div>
                <div className="leading-tight">
                  <div className="text-lg font-semibold tracking-tight">
                    BoxWise
                  </div>
                  <div className="text-xs text-slate-300/80">Admin Portal</div>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Sign in
                  </h2>
                  <p className="mt-1 text-sm text-slate-300/80">
                    Use your admin credentials to continue.
                  </p>
                </div>
              </div>

              {error ? (
                <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              {/*---------------- Login Form ----------------*/}
              <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-200/90"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300/60">
                    <MdOutlineMail />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@boxwise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/40 pl-10 pr-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-400/60 focus:border-primary/50 focus:bg-slate-950/55"
                  />
                </div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-200/90"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300/60">
                    <CiLock />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/40 pl-10 pr-11 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-400/60 focus:border-primary/50 focus:bg-slate-950/55"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-200/80 hover:bg-white/10 hover:text-slate-100"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => alert("Still Processing Lah!")}
                    className="text-sm text-indigo-200/80 hover:text-indigo-200"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className={`cursor-pointer mt-2 h-11 w-full rounded-xl font-semibold tracking-tight bg-primary/80 hover:bg-primary shadow-lg shadow-indigo-500/20 ${
                    loading ? "" : ""
                  }`}
                >
                  {loading ? (
                    <p className="text-animation">
                      Signing in
                      <span>•</span>
                      <span>•</span>
                      <span>•</span>
                    </p>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <div className="pt-2 text-center text-xs text-slate-300/60">
                  Protected section • Authorized personnel only
                </div>
              </form>

              <div className="mt-6 border-t border-white/10 pt-4 text-xs text-slate-300/60">
                <div className="flex items-center justify-between">
                  <span>BoxWise</span>
                  <span>© {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* small bottom fade */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-800 to-transparent" />
    </div>
  );
};

export default Login;
