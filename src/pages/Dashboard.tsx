import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="container flex">
        <Sidebar />
        <div>
          {/* <InputBtn />
          <InputBtn /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
