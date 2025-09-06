import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";
import RestaurantPageItem from "./RestaurantPageItem";
import MySpinner from "../../components/Spinner";

const RestaurantPage = () => {
	const { restaurant_id } = useParams();
	console.log(restaurant_id);

	const [isRestaurantFetched, setIsRestaurantFetched] = useState(false);
	const [restaurant, setRestaurant] = useState([]);
	useEffect(() => {
		try {
			const getRestaurant = async () => {
				const { data } = await axios.get(`/restaurant/${restaurant_id}`);
				setRestaurant(data.restaurant[0]);
				console.log(data.restaurant[0]);
				setIsRestaurantFetched(true);
			};
			getRestaurant();
		} catch (error) {
			alert(error.response.data.message);
		}
	}, [restaurant_id]);

	return (
		<>
			{isRestaurantFetched && <RestaurantPageItem restaurant={restaurant} />}
			{!isRestaurantFetched && <MySpinner />}
		</>
	);
};

export default RestaurantPage;
