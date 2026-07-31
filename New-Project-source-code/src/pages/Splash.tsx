import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../constants/config";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary motion-reduce:animate-none">
      <img
        src="/nativelyai.svg"
        alt=""
        className="w-20 h-20 sm:w-24 sm:h-24 animate-fade-scale motion-reduce:animate-none"
        aria-hidden="true"
      />
      <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-on-primary tracking-tight animate-fade-up motion-reduce:animate-none">
        {APP_NAME}
      </h1>
      <p className="mt-3 text-on-primary/60 text-lg animate-fade-up-delay motion-reduce:animate-none">
        AI-powered flood damage assessment
      </p>
    </div>
  );
}
