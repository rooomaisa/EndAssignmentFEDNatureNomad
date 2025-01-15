import './App.css'
import Navigation from "./components/navigation/Navigation.jsx";
import Footer from "./components/footer/Footer.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import SignUp from "./pages/sign-upPage/Sign-upPage.jsx";
import SignIn from "./pages/sign-inPage/Sign-inPage.jsx";
import Home from "./pages/home/Home.jsx";
import Search from "./pages/searchPage/SearchPage.jsx";
import MyFavouritesPage from "./pages/myFavouritesPage/MyFavouritesPage.jsx";
import NotFound from "./pages/notFoundPage/NotFound.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { useNotification } from "./context/NotificationContext.jsx";
import Notification from "./components/notifications/Notification.jsx";
import SearchComponent from "./components/searchComponent/SearchComponent.jsx";
import ParkDetail from "./components/parkdetail/ParkDetail.jsx";


function App() {

    const {isAuth} = useContext(AuthContext);
    const { notification } = useNotification();

    return (
        <>
            <Navigation/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/search" element={ isAuth ? <Search/> : <Navigate to="/sign-in"/>} />
                    <Route path="/myfavourites" element={ isAuth ? <MyFavouritesPage/> : <Navigate to="/sign-in"/>} />
                    <Route path="/profile" element={ isAuth ? <ProfilePage /> : <Navigate to="/sign-in"/>}/>
                    <Route path="/sign-up" element={<SignUp/>} />
                    <Route path="/sign-in" element={<SignIn/>} />
                    <Route path="*" element={<NotFound/>} />
                    <Route path="/park/:parkCode" element={<ParkDetail/>} />
                </Routes>
            </main>
            {notification && <Notification message={notification.message} type={notification.type} />}
            <Footer/>
        </>
    )
}

export default App
