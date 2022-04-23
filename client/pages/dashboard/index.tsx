import type { NextPage } from "next";
import { useUser } from "../../hooks/useUser";
import Layout from "../../layout/base";
const DashBoard: NextPage = () => {
  const user = useUser();
  const isLogged = user != null;
  return (
    <Layout isLogged={isLogged}>
      {user ? <h1>DashBoard {user?.name}</h1> : "login first pls"}
    </Layout>
  );
};

export default DashBoard;
