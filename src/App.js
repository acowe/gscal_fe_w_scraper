import logo from './logo.svg';
import './style/App.css';
import {Route, Routes, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import OtherPage from "./pages/OtherPage";
import NoPage from "./pages/NoPage";
import SignOutPage from "./pages/SignOutPage";
import {useEffect} from "react";
import WeeklyOverview from './pages/WeeklyOvrvw';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={"/home"} element={<Home />}/>
        <Route path={"/wk_overview"} element={<WeeklyOverview />}/>
        <Route path={"/sign_out"} element={<SignOutPage />}/>
        <Route path={"*"} element={<Navigate to="/home"/>}/>
      </Routes>
    </div>
  );
}

export default App;
