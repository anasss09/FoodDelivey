import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Restaurant from "./Restaurant";
import Styles from './AllRestaurant.module.css'
import axios from '../../utils/axios'
import RestaurantCusinesFood from "./RestaurantCusinesFood";
import Footer from "../Footer/Footer";

const AllRestaurant = () => {
	const restaurantsData = useSelector(state => state.restaurantReducer);
	const [cusineCategoryfood, setcusineCategoryfood] = useState([]);
	const [activeCategory, setActiveCategory] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [categoryPage, setCategoryPage] = useState(1);
	const restaurantRail = useRef(null);
	const restaurantSectionRef = useRef(null);
	const pageSize = 4;


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

	const scrollRestaurants = (direction) => {
		restaurantRail.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
	};
	const categories = ["all", ...new Set(cusineCategoryfood.flatMap((restaurant) => restaurant.cuisines?.map((cuisine) => cuisine.category) || []))];
	const categoryPageSize = 8;
	const totalCategoryPages = Math.max(1, Math.ceil(categories.length / categoryPageSize));
	const pagedCategories = categories.slice((categoryPage - 1) * categoryPageSize, categoryPage * categoryPageSize);
	const totalPages = Math.max(1, Math.ceil(restaurantsData.length / pageSize));
	const pagedRestaurants = restaurantsData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const categoryIcon = (category) => ({ pizza: "🍕", burger: "🍔", indian: "🍛", healthy: "🥗", all: "✦" }[category.toLowerCase()] || "🍽️");
	const selectCategory = (category) => {
		setActiveCategory(category);
		document.getElementById("food-discovery")?.scrollIntoView({ behavior: "smooth", block: "start" });
	};
	const goToRestaurantPage = (page) => {
		setCurrentPage(page);
		restaurantSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<>
			<section className={Styles.homeHero}>
				<div className={Styles.heroContent}>
					<span className={Styles.kicker}><i></i> Delivery made delightful</span>
					<h1>What are you<br /><em>craving today?</em></h1>
					<p>Fresh from the kitchen, delivered when it matters.</p>
					<div className={Styles.categoryChips}>{pagedCategories.map((category) => <button key={category} onClick={() => selectCategory(category)} className={activeCategory === category ? Styles.selectedChip : ""}>{categoryIcon(category)} {category}</button>)}</div>
					{totalCategoryPages > 1 && <div className={Styles.categoryPager}><button onClick={() => setCategoryPage((page) => Math.max(1, page - 1))} disabled={categoryPage === 1}>←</button><span>{categoryPage} / {totalCategoryPages}</span><button onClick={() => setCategoryPage((page) => Math.min(totalCategoryPages, page + 1))} disabled={categoryPage === totalCategoryPages}>Next categories →</button></div>}
				</div>
				<div className={Styles.heroCard}><span>Today's pick</span><strong>Good food.<br />Great mood.</strong><small>Explore local favorites below</small></div>
			</section>

			<section ref={restaurantSectionRef} className={Styles.restaurantSection}>
				<div className={Styles.sectionHeader}>
					<div><span className={Styles.kicker}>Local favorites</span><h2>Restaurants near you</h2></div>
					<div className={Styles.railControls}><button onClick={() => scrollRestaurants(-1)} aria-label="Previous restaurants">←</button><button onClick={() => scrollRestaurants(1)} aria-label="Next restaurants">→</button></div>
				</div>
				<div ref={restaurantRail} className={Styles['restaurants-list']}>
				{pagedRestaurants.map((restaurant, index) => (
					<Restaurant key={index} restaurant={restaurant} />
				))}
			</div>
				{totalPages > 1 && <div className={Styles.pagination}><button onClick={() => goToRestaurantPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>← Previous</button>{Array.from({ length: totalPages }, (_, index) => <button key={index} onClick={() => goToRestaurantPage(index + 1)} className={currentPage === index + 1 ? Styles.activePage : ""}>{index + 1}</button>)}<button onClick={() => goToRestaurantPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next →</button></div>}
			</section>

			<div id="food-discovery" className={Styles.foodArea}>
				<RestaurantCusinesFood data={cusineCategoryfood} selectedCategory={activeCategory} />
			</div>

			<Footer />
		</>
	);
};

export default AllRestaurant;
