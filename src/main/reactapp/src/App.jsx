// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import AdminInfo from './pages/AdminInfo';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/info" element={<AdminInfo />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
