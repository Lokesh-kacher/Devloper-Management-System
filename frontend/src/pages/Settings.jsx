import React, { useState } from "react";
import API from "../api/axios";
import MainLayout from "../components/MainLayout";

// ── small shared input ──────────────────────────────────────────────────────
const Field = ({ label, ...props }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full border border-card-border bg-gray-50 p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-900"
    />
  </div>
);

// ── alert banner ────────────────────────────────────────────────────────────
const Alert = ({ msg }) => {
  if (!msg.text) return null;
  const ok = msg.type === "success";
  return (
    <div
      className={`flex items-center space-x-2 p-4 rounded-xl text-sm font-bold ${
        ok ? "bg-stone-100 text-stone-700" : "bg-red-50 text-red-600"
      }`}
    >
      <span>{ok ? "✓" : "!"}</span>
      <span>{msg.text}</span>
    </div>
  );
};

// ── Password-reset card with 3-step OTP flow ────────────────────────────────
const PasswordSection = () => {
  const [step, setStep] = useState("idle"); // idle | sent | confirm
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const notify = (text, type = "success") => setMsg({ text, type });
  const reset = () => {
    setStep("idle");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMsg({ text: "", type: "" });
  };

  // Step 1 – send OTP to the stored email
  const sendOtp = async () => {
    if (!email) return notify("Please enter your email address.", "error");
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const res = await API.post("/auth/forgot-password", { email });
      notify(res.data.message || "OTP sent to your email.");
      setStep("sent");
    } catch (err) {
      notify(err.response?.data?.message || "Failed to send OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 – verify OTP + set new password
  const confirmReset = async () => {
    if (!otp) return notify("Enter the OTP you received.", "error");
    if (!newPassword) return notify("Enter a new password.", "error");
    if (newPassword !== confirmPassword)
      return notify("Passwords do not match.", "error");

    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      notify(res.data.message || "Password updated successfully.");
      setStep("confirm");
    } catch (err) {
      notify(err.response?.data?.message || "Reset failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-card-border p-8 space-y-6">
      {/* header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Change Password
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            We'll email you a one-time code to verify your identity before
            updating your password.
          </p>
        </div>
        {/* step badge */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-card-border px-3 py-1.5 rounded-full">
          {step === "idle" && "Step 1 of 2"}
          {step === "sent" && "Step 2 of 2"}
          {step === "confirm" && "Done"}
        </span>
      </div>

      <Alert msg={msg} />

      {/* ── IDLE: ask for email ── */}
      {step === "idle" && (
        <div className="space-y-5">
          <Field
            label="Your Account Email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:opacity-80 transition-all active:scale-95 disabled:opacity-40"
          >
            {loading ? "Sending code…" : "Send Verification Code →"}
          </button>
        </div>
      )}

      {/* ── SENT: enter OTP + new password ── */}
      {step === "sent" && (
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-card-border bg-gray-50 p-4 text-center text-2xl font-bold font-mono tracking-[10px] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            />
            <p className="text-[11px] text-gray-400 font-medium mt-2">
              Code sent to <span className="text-gray-700 font-bold">{email}</span>
            </p>
          </div>

          <Field
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Field
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={confirmReset}
              disabled={loading}
              className="flex-1 bg-primary text-white p-4 rounded-xl font-bold hover:opacity-80 transition-all active:scale-95 disabled:opacity-40"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
            <button
              onClick={reset}
              className="px-6 bg-gray-50 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── CONFIRM: success state ── */}
      {step === "confirm" && (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <p className="text-gray-900 font-bold text-lg">Password Updated</p>
          <p className="text-gray-500 text-sm font-medium">
            Your password has been changed successfully. Use it next time you log
            in.
          </p>
          <button
            onClick={reset}
            className="mt-4 text-sm font-bold text-gray-400 hover:text-gray-700 uppercase tracking-widest transition-colors"
          >
            Change again
          </button>
        </div>
      )}
    </div>
  );
};

// ── Danger zone ─────────────────────────────────────────────────────────────
const DangerSection = () => (
  <div className="bg-white rounded-[24px] border border-red-100 p-8">
    <h2 className="text-xl font-bold tracking-tight mb-1">
      Erase Data
    </h2>
    <p className="text-gray-500 text-sm font-medium mb-6">
      Please proceed with caution. These actions are irreversible.
    </p>
    <div className="flex items-center justify-between p-5 border border-red-100 rounded-2xl bg-red-50/40">
      <div>
        <p className="font-bold text-gray-900 text-sm">Delete Account</p>
        <p className="text-gray-500 text-xs font-medium mt-0.5">
          Permanently remove your account and all associated data.
        </p>
      </div>
      <button
        onClick={() => window.confirm("Are you sure? This cannot be undone.") && alert("Contact admin to complete deletion.")}
        className="ml-6 shrink-0 border border-red-300 text-red-500 px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
      >
        Delete Account
      </button>
    </div>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────
const Settings = () => (
  <MainLayout
    title="Settings"
    breadcrumbs={[{ label: "Settings" }]}
  >
    <div className="max-w-2xl space-y-8">
      {/* section label */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Manage your security and account preferences.
        </p>
      </div>

      <PasswordSection />
      <DangerSection />
    </div>
  </MainLayout>
);

export default Settings;
