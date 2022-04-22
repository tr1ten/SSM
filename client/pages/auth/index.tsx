import type { NextPage } from "next";
import { FormEvent, FormEventHandler, useRef } from "react";

const Auth: NextPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const reqBody = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    };
    fetch("http://localhost:3001/auth", {
      // this is necessary for cors-preflight req else req fails
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
      method:'POST',
      redirect:"follow"
    });
  };
  return (
    <form method="POST" onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input ref={nameRef} name="name" id="name" />
      <label htmlFor="email">Email</label>
      <input ref={emailRef} type="email" name="email" id="email" />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default Auth;
