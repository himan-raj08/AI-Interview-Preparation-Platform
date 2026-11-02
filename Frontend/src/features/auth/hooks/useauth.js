
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import {
    login,
    logout,
    register,
    getMe
} from "../../../services/auth.api";

const useAuth = () => {
    const context = useContext(AuthContext);

    const {
        user,
        setUser,
        loading,
        setLoading
    } = context;

    const handlelogin = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await login({
                email,
                password
            });

            setUser(data.user);

            return data;
        } catch (error) {
            console.log(
                "Login Error:",
                error.response?.data || error.message
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleregister = async ({ userName, email, password }) => {
        setLoading(true);

        try {
            const data = await register({
                userName,
                email,
                password
            });

            setUser(data.user);

            return data;
        } catch (error) {
            console.log(
                "Register Error:",
                error.response?.data || error.message
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handlelogout = async () => {
        setLoading(true);

        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.log(
                "Logout Error:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (error) {
                console.log(
                    "Get Me Error:",
                    error.response?.data || error.message
                );

                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return {
        user,
        loading,
        setLoading,
        setUser,
        handlelogin,
        handleregister,
        handlelogout
    };
};

export default useAuth;

