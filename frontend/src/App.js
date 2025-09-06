import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login-Signup/Login";
import Signup from "./pages/Login-Signup/Signup";
import Home from "./pages/Home";
import RestaurantPage from "./pages/RestaurantPages/RestaurantPage";
import Cart from "./pages/Cart";
import History from "./pages/History";
import Logout from "./components/Logout";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import { ToastContainer } from 'react-toastify';
import Reviews from "./components/RestaurantPagesNavlink/Reviews";
import Overview from "./components/RestaurantPagesNavlink/Overview";
import Photos from "./components/RestaurantPagesNavlink/Photos";
import Menu from "./components/RestaurantPagesNavlink/Manu";
import { FormRestaurantReview } from "./components/RestaurantPagesNavlink/FormRestaurantReview";


const App = () => {
	return (
		<div className="App">
			<Routes >
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/app" element={<Home />} />
				<Route path="/app/:restaurant_id" element={<RestaurantPage />} >
					<Route index element={<Overview />} />
					<Route path="reviews" element={<Reviews />} />
					<Route path="photos" element={<Photos />} />
					<Route path="menu" element={<Menu />} />
				</Route>
				<Route path="/cart" element={<Cart />} />
				<Route path="/history" element={<History />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>

			{/* Your routes/components */}
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				pauseOnHover
				draggable
				pauseOnFocusLoss
				closeButton={false}
			/>

		</div>
	);
};

export default App;
