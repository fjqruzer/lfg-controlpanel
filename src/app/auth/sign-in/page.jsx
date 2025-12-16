'use client';

import React, { useState, useEffect, Suspense } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { requestOtp, verifyOtp, resendOtp, isAdminUser, logout } from "@/services/authService";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard/home";

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log("[SignIn] Submitting email step", { email });
    setError("");
    try {
      setLoading(true);
      console.log("[SignIn] Calling requestOtp...");
      const data = await requestOtp(email);
      console.log("[SignIn] requestOtp success", data);
      if (data.next === "otp") {
        setStep("otp");
        setCountdown(60); // Start 60 second countdown
      }
    } catch (err) {
      console.error("[SignIn] requestOtp error", err);
      setError(err.message || "Failed to send OTP");
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
      const data = await verifyOtp(email, code);
      console.log("[SignIn] verifyOtp success", data);

      // Check admin role from user data in response
      console.log("[SignIn] Checking admin role from user data...", { user: data.user });
      const isAdmin = isAdminUser(data.user);
      console.log("[SignIn] Admin check result:", isAdmin);

      if (isAdmin) {
        console.log("[SignIn] Admin verified, redirecting", { nextPath });
        router.replace(nextPath);
      } else {
        // Not an admin - clear tokens and show error
        logout();
        setError("Access denied. Admin privileges required.");
      }
    } catch (err) {
      console.error("[SignIn] verifyOtp error", err);
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    
    console.log("[SignIn] Resending OTP", { email });
    setError("");
    try {
      setLoading(true);
      await resendOtp(email);
      console.log("[SignIn] OTP resent successfully");
      setCountdown(60);
      setCode(""); // Clear previous code
    } catch (err) {
      console.error("[SignIn] Resend OTP error", err);
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setCode("");
    setError("");
    setCountdown(0);
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            {step === "email" ? "Admin Sign In" : "Enter OTP"}
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            {step === "email"
              ? "Enter your admin email to receive a one-time code."
              : `We sent a 6-digit code to ${email}.`}
          </Typography>
        </div>

        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={step === "email" ? handleEmailSubmit : handleOtpSubmit}
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

          {step === "email" ? (
            <div className="mb-1 flex flex-col gap-6">
              <Typography
                variant="small"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                Your email
              </Typography>
              <Input
                type="email"
                size="lg"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
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
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  // Only allow digits and max 6 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                }}
                maxLength={6}
                required
                disabled={loading}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 text-center tracking-widest text-lg"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {countdown > 0 && (
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="text-center"
                >
                  Resend OTP in {countdown} seconds
                </Typography>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="mt-6 flex items-center justify-center gap-2"
            fullWidth
            disabled={loading || (step === "otp" && code.length !== 6)}
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>
              {step === "email"
                ? loading
                  ? "Sending code..."
                  : "Send OTP"
                : loading
                ? "Verifying..."
                : "Verify & Sign In"}
            </span>
          </Button>

          {step === "otp" && (
            <div className="flex items-center justify-between mt-4 gap-4">
              <Button
                type="button"
                variant="text"
                onClick={handleBackToEmail}
                disabled={loading}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
                className="flex-1"
              >
                {countdown > 0 ? `Resend (${countdown}s)` : "Resend OTP"}
              </Button>
            </div>
          )}

          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-6"
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
          alt="Background pattern"
        />
      </div>
    </section>
  );
}

export function SignIn() {
  return (
    <Suspense fallback={
      <section className="m-8 flex gap-4">
        <div className="w-full lg:w-3/5 mt-24">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">
              Admin Sign In
            </Typography>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal"
            >
              Loading...
            </Typography>
          </div>
        </div>
      </section>
    }>
      <SignInForm />
    </Suspense>
  );
}

export default SignIn;
