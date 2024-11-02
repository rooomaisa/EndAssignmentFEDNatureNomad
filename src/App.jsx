import './App.css'
import Navigation from "./components/navigation/Navigation.jsx";
import Footer from "./components/footer/Footer.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import SignUp from "./pages/sign-upPage/Sign-upPage.jsx";
import SignIn from "./pages/sign-inPage/Sign-inPage.jsx";
import Home from "./pages/home/Home.jsx";
import Search from "./pages/searchPage/SearchPage.jsx";
import ParkDetail from "./pages/parkDetailPage/ParkDetailPage.jsx";
import MyFavouritesPage from "./pages/myFavouritesPage/MyFavouritesPage.jsx";
import NotFound from "./pages/notFoundPage/NotFound.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext.jsx";




function App() {

    const {isAuth} = useContext(AuthContext);

    return (
        <>
            <Navigation/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/search" element={ isAuth ? <Search/> : <Navigate to="/signin"/>} />
                    <Route path="/park/:id" element={ isAuth ? <ParkDetail/> : <Navigate to="/signin"/>} />
                    <Route path="/myfavourites" element={ isAuth ? <MyFavouritesPage/> : <Navigate to="/signin"/>} />
                    <Route path="/profile" element={ isAuth ? <ProfilePage /> : <Navigate to="/signin"/>}/>
                    {/*<Route path="/profile" element={<ProfilePage />} />*/}
                    <Route path="/sign-up" element={<SignUp/>} />
                    <Route path="/sign-in" element={<SignIn/>} />
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </main>
            <Footer/>


        </>
    )
}

export default App
