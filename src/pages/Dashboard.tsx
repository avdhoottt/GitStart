import React, { useState } from "react";
import { useRepo } from "../context/useInput";
import { getFirestore } from "firebase/firestore";
import { db } from "../auth/firebase";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
    </div>
  );
};

export default Dashboard;
