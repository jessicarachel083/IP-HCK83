import { Routes, Route } from 'react-router'
// import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PetDetails from './pages/PetDetails'
import CreatePet from './pages/CreatePet'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {

  return (
    <>
      <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pets/:id" element={<PetDetails />} />
          
          {/* Protected Routes */}
          <Route path="/create-pet" element={
            <ProtectedRoute>
              <CreatePet />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
    </>
  )
}

export default App
