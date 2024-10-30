import {jwtDecode} from "jwt-decode";
import axios from "axios";

export async function validateToken(token, setAuth, setError) {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
            const response = await axios.get(`http://localhost:3000/600/users/${decodedToken.sub}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            setAuth({
                isAuth: true,
                user: {
                    email: response.data.email,
                    username: response.data.username,
                    id: response.data.id,
                },
                status: 'done',
            });
        } else {
            localStorage.removeItem('token');
            setAuth({ isAuth: false, user: null, status: 'done'});
        }
    } catch (e) {
        console.error("Token validation failed:", e);
        setError("Failed to validate token.");
        setAuth({ isAuth: false, user: null, status:'done' });
    }
}

export default validateToken;