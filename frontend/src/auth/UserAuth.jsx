import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'

const UserAuth = ({ children }) => {
    const { user } = useContext(UserContext)
    const [checkingAuth, setCheckingAuth] = useState(true)

    useEffect(() => {
        // Give time for context to load user from localStorage
        const timeout = setTimeout(() => {
            setCheckingAuth(false)
        }, 100)

        return () => clearTimeout(timeout)
    }, [])

    if (checkingAuth) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export default UserAuth
