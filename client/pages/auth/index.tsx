import type { NextPage } from "next";
import { FormEventHandler, useRef } from "react";
import Layout from "../../layout/base";

const Auth: NextPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const reqBody = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
    try {
      const res = await fetch("http://localhost:3001/auth", {
        // this is necessary for cors-preflight req else req fails
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
        method: "POST",
        redirect: "follow",
      });
      const tokenObj = await res.json();
      if (res.ok) {
        window.localStorage.setItem("jwt", tokenObj.jwt);
      }
    } catch (err) {
      console.log("error while authenticating ", err);
    }
  };
  return (
    <Layout isLogged={false}>
      <form method="POST" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input ref={nameRef} name="name" id="name" />
        <label htmlFor="email">Email</label>
        <input ref={emailRef} type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input
          ref={passwordRef}
          type="password"
          name="password"
          id="password"
        />
        <input type="submit" value="Submit" />
      </form>
    </Layout>
  );
};

export default Auth;
