import { useState } from 'react'
import { LoginPage } from "./pages/LoginPage.jsx"
import { DashBoardPage } from './pages/DashBoardPage.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { PedidosPage } from './pages/PedidosPage.jsx'
import { VentasPage } from './pages/VentasPage.jsx'
import { ArticulosPage } from './pages/ArticulosPage.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [usuario, setUsuario] = useState(null);

  const handleLoginSuccess = (user) => {
      setIsLoggedIn(true)
      setUsuario(user)
  }


  return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <DashBoardPage usuario={usuario} />
                    </ProtectedRoute>
                } />
                <Route path="/pedidos" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <PedidosPage />
                    </ProtectedRoute>
                } />
                <Route path="/ventas" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <VentasPage />
                    </ProtectedRoute>
                } />
                <Route path="/articulos" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <ArticulosPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App
