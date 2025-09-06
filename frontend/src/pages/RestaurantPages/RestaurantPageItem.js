import React, { useEffect, useState } from 'react'
import FoodImageCarousel from "../../components/FoodItems/FoodImage";
import Styles from "./RestaurantPageItem.module.css";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
const RestaurantPageItem = ({ restaurant }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [cusineCategory, setCusineCategory] = useState("");
    const [cusineFood, setCusineFood] = useState([]);

    // Set default category when restaurant changes
    useEffect(() => {
        if (restaurant?.cusines?.length > 0) {
            setCusineCategory(restaurant.cusines[0].category); // ✅ default first category
            setCusineFood(restaurant.cusines[0].food);         // ✅ default first food list
        }
    }, [restaurant]);

    // Update food when category changes
    useEffect(() => {
        if (cusineCategory) {
            const food = restaurant.cusines.find(item => item.category === cusineCategory);
            if (food) setCusineFood(food.food);
        }
    }, [cusineCategory, restaurant]);

    const cusineCategoryHandler = (category) => {
        setCusineCategory(category);

    }

    return (
        <div className={Styles['restaurant-item-page-fix']}>
            <div className={Styles['carousel']}>
                <FoodImageCarousel
                    address={restaurant.address}
                    imageUrl={restaurant.coverImage}
                    name={restaurant.name}
                    contact={restaurant.contact}
                    cusines={restaurant.cusines}
                />

                {/* Tabs */}
                <div className={Styles['tabs-container']}>
                    <NavLink to="" end className={({ isActive }) =>
                        `${Styles['tab-item']} ${isActive ? Styles['active-tab'] : ""}`
                    }>Overview</NavLink>

                    <NavLink to="reviews" className={({ isActive }) =>
                        `${Styles['tab-item']} ${isActive ? Styles['active-tab'] : ""}`
                    }>Reviews</NavLink>

                    <NavLink to="photos" className={({ isActive }) =>
                        `${Styles['tab-item']} ${isActive ? Styles['active-tab'] : ""}`
                    }>Photos</NavLink>

                    <NavLink to="menu" className={({ isActive }) =>
                        `${Styles['tab-item']} ${isActive ? Styles['active-tab'] : ""}`
                    }>Menu</NavLink>
                </div>

                {/* Outlet will render the tab content */}
                <div className={Styles['tab-content']}>
                    <Outlet
                        context={{ restaurant, cusineCategory, cusineFood, setCusineCategory }}
                    />
                </div>
            </div>
        </div>
    )
}

export default RestaurantPageItem