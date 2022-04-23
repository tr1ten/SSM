import {useState,useEffect} from "react"
type User= {
    name:string,
    email:string,
}
export function useUser(){
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const jwt = window.localStorage.getItem("jwt");
        const getUser = async () => {
          if (!jwt) {
            return null;
          }
          const res = await fetch(`http://localhost:3001/auth?jwtToken=${jwt}`);
          if (res.ok) {
            const fuser = (await res.json())?.user;
            return fuser;
          }
          return null;
        };
        getUser().then(setUser);
      }, []);
      return user;
}