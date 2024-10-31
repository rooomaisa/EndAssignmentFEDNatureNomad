import {jwtDecode} from "jwt-decode";
import axios from "axios";

export async function validateToken(token, setAuth, setError) {
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        // const username= decodedToken.username;

        if (decodedToken.exp > currentTime) {
            const response =
            await axios.get(`https://api.datavortex.nl/naturenomad/users/${decodedToken.sub}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-Api-Key": "naturenomad:Ic0HJDZjRv9QEebv4tta",
                }
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