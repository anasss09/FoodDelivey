import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Restaurant from "./Restaurant";
import Styles from './AllRestaurant.module.css'
import axios from '../../utils/axios'
import RestaurantCusinesFood from "./RestaurantCusinesFood";
import Footer from "../Footer/Footer";

const AllRestaurant = () => {
	const restaurantsData = useSelector(state => state.restaurantReducer);
	const [cusineCategoryfood, setcusineCategoryfood] = useState([]);


	useEffect(() => {
		async function getFoodItemsCategoryWise() {
			try {
				const { data } = await axios.get(
					"restaurant/foods/all-restaurant-food-items"
				);
				console.log(data.foodItems);
				

				setcusineCategoryfood(data.foodItems);
			} catch (error) {
				console.log(error.response?.data?.message || error.message);
			}
		}

		getFoodItemsCategoryWise();
	}, []);

	return (
		<>
			<div className={Styles['restaurants-list']}>
				{restaurantsData.map((restaurant, index) => (
					<Restaurant key={index} restaurant={restaurant} />
				))}
			</div>

			<div>
				<RestaurantCusinesFood data={cusineCategoryfood} />
			</div>

			<Footer />
		</>
	);
};

export default AllRestaurant;
