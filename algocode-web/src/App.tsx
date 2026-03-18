import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProblemsList from './pages/ProblemsList'
import Workspace from './pages/Workspace'
import AddProblem from './pages/AddProblem'
import Sheets from './pages/Sheets'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--color-cc-bg)] text-[var(--color-cc-text)] overflow-hidden font-sans">
      <Navbar />
      <div className="flex-1 overflow-auto h-[calc(100vh-4rem)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<ProblemsList />} />
          <Route path="/problems/:id" element={<Workspace />} />
          <Route path="/add-problem" element={<AddProblem />} />
          <Route path="/sheets" element={<Sheets />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
