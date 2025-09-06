import React from 'react'
import axios from "../../utils/axios";
import { toast } from 'react-toastify';
import Styles from './FoodItem.module.css'

const FoodItem = ({ food, category, restaurantName }) => {
    console.log(food);
    const addToCartHandler = (id, category, restaurantName) => {
        category = encodeURIComponent(category)
        restaurantName = encodeURIComponent(restaurantName)
        try {
            async function addToCart() {
                const { data } = await axios.get(`/restaurant/cart/add-cart/${id}?category=${category}&restaurant_name=${restaurantName}`)
                console.log(data);
            }
            addToCart();
            toast.success("Item added to the Cart")
        } catch (error) {
            alert(error.response.data.message);
        }
    }
    return (
        <div className={Styles['food-item-container']}>
            <div className={Styles['food-item-image']}>
                <img src={food?.images[0]?.url} alt="food-item-image" />
            </div>
            <div className={Styles['food-item-details']}>
                <div className={Styles['food-item-name']}>{food.name}</div>
                <div className={Styles['food-item-price']}>{food.price}</div>
                <div className={Styles['food-item-description']}>{food.description}</div>
                <button className={Styles['add-to-cart-btn']}
                    onClick={() => addToCartHandler(food._id, category, restaurantName)}>
                    Add To Cart
                </button>

            </div>
        </div>
    )
}

export default FoodItem