export const logout = async () => {
  console.log("logging out user");
  const jwt = window.localStorage.getItem("jwt");
  if (!jwt) {
    return;
  }
  try {
    const res = await fetch(`http://localhost:3001/auth/revoke?jwt=${jwt}`, {
      method: "POST",
    });
    if (res.ok) {
      window.localStorage.removeItem("jwt");
      window.location.reload();
    }
  } catch (err) {
    console.log("error while revoking jwt", err);
  }
};
