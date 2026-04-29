import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import styles from "./AppLayout.module.css";
import User from "../components/User";
// import { Outlet } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useAuth } from "../contexts/FakeAuthContext";

function AppLayout() {
  // const { isAuthenticated } = useAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated) navigate("login");
  // }, [isAuthenticated, navigate]);

  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
