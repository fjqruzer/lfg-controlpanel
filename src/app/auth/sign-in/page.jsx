'use client';

import React, { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginPassword, verifyOtp } from "@/services/authService";

export function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard/home";

  const [step, setStep] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    console.log("[SignIn] Submitting password step", { email });
    setError("");
    try {
      setLoading(true);
      console.log("[SignIn] Calling loginPassword...");
      await loginPassword(email, password);
      console.log("[SignIn] loginPassword success, moving to OTP step");
      setStep("otp");
    } catch (err) {
      console.error("[SignIn] loginPassword error", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log("[SignIn] Submitting OTP step", { email, code });
    setError("");
    try {
      setLoading(true);
      console.log("[SignIn] Calling verifyOtp...");
      await verifyOtp(email, code);
      console.log("[SignIn] verifyOtp success, redirecting", { nextPath });
      router.replace(nextPath);
    } catch (err) {
      console.error("[SignIn] verifyOtp error", err);
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            {step === "password" ? "Sign In" : "Enter OTP"}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            {step === "password"
              ? "Enter your email and password to receive a one-time code."
              : `We sent a 6-digit code to ${email}.`}
          </Typography>
        </div>

        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={step === "password" ? handlePasswordSubmit : handleOtpSubmit}
        >
          <div className="mb-4">
            {error && (
              <Typography
                variant="small"
                className="text-red-500 text-center font-medium"
              >
                {error}
              </Typography>
            )}
          </div>

          {step === "password" ? (
            <div className="mb-1 flex flex-col gap-6">
              <Typography
                variant="small"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                Your email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography
                variant="small"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          ) : (
            <div className="mb-1 flex flex-col gap-6">
              <Typography
                variant="small"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                One-time code
              </Typography>
              <Input
                size="lg"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          )}

          <Button
            type="submit"
            className="mt-6 flex items-center justify-center gap-2"
            fullWidth
            disabled={loading}
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>
              {step === "password"
                ? loading
                  ? "Sending code..."
                  : "Continue"
                : loading
                ? "Verifying..."
                : "Verify & Sign In"}
            </span>
          </Button>

          <div className="flex items-center justify-end mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">Forgot Password</a>
            </Typography>
          </div>

          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Not registered?
            <Link href="/auth/sign-up" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;

