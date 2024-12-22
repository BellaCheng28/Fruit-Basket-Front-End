// src/components/Dashboard/Dashboard.jsx
import { useContext,useEffect } from "react";
import { AuthedUserContext } from "../../App";

// src/components/Dashboard.jsx

const Dashboard = () => {
  const user = useContext(AuthedUserContext);

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>
        This is the dashboard page where you, and only you, can see a dashboard
        of all of your things.
      </p>
    </main>
  );

};

export default Dashboard;
