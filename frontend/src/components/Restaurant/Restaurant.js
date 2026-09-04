import React from "react";
import { Link } from 'react-router-dom';
import Styles from './AllRestaurant.module.css';

const Restaurant = ({ restaurant }) => {
	return (
		<Link to={`/app/${restaurant._id}`} className={Styles.restaurantCardLink} aria-label={`View ${restaurant.name}`}>
		<article className={Styles.restaurantCard}>
			<div className={Styles.restaurantImage}><img src={restaurant.coverImage} alt={restaurant.name} /><span>Open now</span><b>★ 4.6</b></div>
			<div className={Styles.restaurantBody}>
				<h3 title={restaurant.name}>{restaurant.name}</h3>
				<p>{restaurant.cusines?.slice(0, 3).map((c) => c.category).join(' · ') || 'Fresh food'}</p>
				<div><small>📍 {restaurant.address}</small><span className={Styles.cardArrow}>↗</span></div>
			</div>
		</article>
		</Link>
	);

};

export default Restaurant;
