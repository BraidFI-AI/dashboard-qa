"use client";

import Paper from "@mui/material/Paper";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className="w-full h-full bg-slate-200">
      <div className="h-full flex flex-col items-center justify-center">
        <Paper
          variant="elevation"
          className="sm:w-full w-full h-full sm:max-w-[380px] 
          sm:h-auto sm:px-10 sm:py-8 rounded-none 
          sm:rounded-xl 
          sm:shadow-xl"
        >
          <div className="p-4 sm:p-0">
            <LoginForm></LoginForm>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Login;
