import'./App.css'
import { BrowserRouter as Router, Routes, Route,Navigate,} from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import Signin from './pages/Signin'
import Instructions from './pages/Instructions'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard';
import ExamQuestions from './pages/ExamQuestions';
function App() {
  return (
    <>
        {/* This is the alias of BrowserRouter i.e. Router */}
        <Router>
            <Routes>
                {/* This route is for home component 
      with exact path "/", in component props 
      we passes the imported component*/}
                <Route
                    exact
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/Login"
                    element={<Login />}
                />
                <Route
                    path="/Instructions"
                    element={<Instructions />}
                />
                 <Route
                    path="/Signin"
                    element={<Signin />}
                />
                 <Route
                    path="/Profile"
                    element={<Profile />}
                />
                 <Route
                    path="/Settings"
                    element={<Settings />}
                />
                 <Route
                    path="/Dashboard"
                    element={<Dashboard />}
                />
                 <Route
                    path="/ExamQuestions"
                    element={<ExamQuestions />}
                />

                {/* If any route mismatches the upper 
      route endpoints then, redirect triggers 
      and redirects app to home component with to="/" */}
                {/* <Redirect to="/" /> */}
                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />
            </Routes>
        </Router>
    </>
);
}

export default App;
