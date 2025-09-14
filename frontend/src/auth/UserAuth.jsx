import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const UserAuth = ({ children }) => {
    const { user, setUser } = useContext(UserContext);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!user && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Finish auth check after loading
        const timeout = setTimeout(() => {
            setCheckingAuth(false);
        }, 100);

        return () => clearTimeout(timeout);
    }, [user, setUser]);

    if (checkingAuth) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default UserAuth;
