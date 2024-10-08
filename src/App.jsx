import './App.css'
import Navigation from "./components/navigation/Navigation.jsx";
import Footer from "./components/footer/Footer.jsx";
import {Route, Routes} from "react-router-dom";
import SignUp from "./pages/sign-upPage/Sign-upPage.jsx";
import SignIn from "./pages/sign-inPage/Sign-inPage.jsx";
import Home from "./pages/home/Home.jsx";
import Search from "./pages/searchPage/SearchPage.jsx";
import ParkDetail from "./pages/parkDetailPage/ParkDetailPage.jsx";
import MyFavouritesPage from "./pages/myFavouritesPage/MyFavouritesPage.jsx";
import NotFound from "./pages/notFoundPage/NotFound.jsx";
// import logo from './assets/logo-white.png'



function App() {
    return (
        <>
            <Navigation/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/sign-up" element={<SignUp/>} />
                    <Route path="/sign-in" element={<SignIn/>} />
                    <Route path="/search" element={<Search/>} />
                    <Route path="/park/:id" element={<ParkDetail/>} />
                    <Route path="/myfavourites" element={<MyFavouritesPage/>} />
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </main>
            <Footer/>


        </>
    )
}

export default App
