import axios from "../utils/axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllRestaurants from "../components/Restaurant/AllRestaurants";
import MySpinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const userData = useSelector((state) => state.userReducer);
	const dispatch = useDispatch();
	const navigate = useNavigate()
	const [isRestaurantsFetched, setisRestaurantFetched] = useState(false);

	useEffect(() => {
		async function getRestaurantDetails() {
			try {
				let { data } = await axios.get("restaurant/all");
				dispatch({ type: "SET_RESTAURANTS", payload: data.restaurant })
        		setisRestaurantFetched(true)
			} catch (error) {
				console.log(error.response.data.message);
        
			}
		}

		getRestaurantDetails();
	}, []);

	return (
    <>
            {
                userData.isLoggedIn && <div>
                    {!isRestaurantsFetched && <MySpinner />}
                    {isRestaurantsFetched && <AllRestaurants />}
                    {/* <Outlet /> */}
                </div>
            }

            {!userData.isLoggedIn && navigate('/')}


        </>
  );
};

export default Home;
