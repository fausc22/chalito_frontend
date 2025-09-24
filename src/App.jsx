// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Toaster from './components/common/Toaster';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <div className="App">
            <AppRoutes />
            <Toaster />
          </div>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;