import React from "react";
import dynamic from "next/dynamic";
const App = dynamic(() => import("../admin/App"), { ssr: false });

const AdminPage = () => {
  return <App />;
};

export default AdminPage;
