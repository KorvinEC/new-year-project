// External imports
import { Routes, Route, Navigate } from 'react-router-dom';

// Local imports
import { useUserStore } from '@enteties/User/model';
import { useEffect } from 'react';
import HomePage from '../pages/Home';
import { LoginPage } from '../pages/Login/LoginPage';

// Component definition
function App() {
    const isAuth = useUserStore((state) => state.isAuth);

    useEffect(() => {}, [isAuth]);
    return (
        <div>
            {
                isAuth ? (
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Navigate to="/" />} />
                    </Routes>
                )
                    : (
                        <Routes>
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<LoginPage />} />
                        </Routes>
                    )
            }
        </div>
    );
}

// Default export
export default App;
