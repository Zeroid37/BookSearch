// src/components/Header.tsx
import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                <NavLink to="/books" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Books </NavLink>
                <NavLink to="/searchBooks" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Search Books </NavLink>
                <NavLink to="/registerBooks" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Register Book </NavLink>
                <NavLink to="/Login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login </NavLink>
                <NavLink to="/Register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Register </NavLink>
                <NavLink to="/Profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile </NavLink>
            </nav>
        </header>
    );
}

export default Header;