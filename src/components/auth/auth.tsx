"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { SignupForm } from "./sign-up-form";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);


  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your email and password to login"
              : "Enter your details to create an account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm />
          )}

          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button
              variant="link"
              className="p-0 text-sm"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Auth;