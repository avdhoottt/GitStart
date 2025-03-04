import React, { useState } from "react";
import { signInWithGithub } from "../auth/firebase";

interface LoginButtonProps {
  className: string;
  label: string;
}

const LoginButton = ({ className, label }: LoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGithub();
    } catch (e) {
      console.error("Login Failed", e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`${className}`}
    >
      {label}
    </button>
  );
};

export default LoginButton;
