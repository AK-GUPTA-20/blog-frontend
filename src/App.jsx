import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import LenisProvider from "./components/LenisProvider"
import { AuthProvider } from "./context/AuthContext"
import { ToastContainer } from "./components/Toast"

import Home from "./pages/Home"
import Post from "./pages/Post"
import Categories from "./pages/Categories"
import About from "./pages/About"
import Blogs from "./pages/Blogs"
import Authors from "./pages/Authors"
import Login from "./pages/Login"
import Register from "./pages/Register"
import OtpVerify from "./pages/OtpVerify"
import MyProfile from "./pages/MyProfile"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="velora-theme">
      <AuthProvider>
        <LenisProvider>
          <Router>
            <ToastContainer />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pt-24">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:slug" element={<Post />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/authors" element={<Authors />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-otp" element={<OtpVerify />} />
                  <Route path="/my-profile" element={<MyProfile />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </LenisProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

