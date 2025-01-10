import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookSearch from "./pages/BookSearch";
import BookRegistration from "./pages/BookRegistration";
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import "./App.css";
import Profile from "./pages/Profile.tsx";


function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/searchBooks" element={<BookSearch />} />
                    <Route path="/registerBooks" element={
                        <ProtectedRoute>
                            <BookRegistration />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
export default App;