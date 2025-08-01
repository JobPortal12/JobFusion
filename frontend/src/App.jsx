import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Jobs from "./components/Jobs";
import AdminJobs from "./components/admin/AdminJobs";
import Browse from "./components/Browse";
import Forgot from "./components/auth/Forgot";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ResetPassword from "./components/auth/ResetPassword";
import SavedJobs from "./components/SavedJobs";
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/forgot",
    element: <Forgot />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword/>
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/saved-jobs",
    element: <SavedJobs />,
  },
  //admin side
  {
    path: "/admin/companies",
    element:<ProtectedRoute> <Companies/></ProtectedRoute>
  },{
    path :"/admin/companies/create",
    element :<ProtectedRoute><CompanyCreate/></ProtectedRoute>
  },{
    path :"/admin/companies/:id",
    element :<ProtectedRoute><CompanySetup/></ProtectedRoute>
  },{
    path:"/admin/jobs",
    element:<ProtectedRoute> <AdminJobs/></ProtectedRoute>
  },{
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob/></ProtectedRoute>
  },{
    path:"/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants/></ProtectedRoute>
  }
]);
 

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} /> 
      {/* provide router so that app can find for this route we to run this  */}
    </div>
  );
}

export default App;
