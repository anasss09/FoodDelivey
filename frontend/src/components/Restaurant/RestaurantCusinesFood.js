import React from "react";
import Styles from "./RestaurantCusinesFood.module.css";
import axios from '../../utils/axios'
import { toast } from "react-toastify";

const RestaurantCusinesFood = ({ data }) => {

   const addToCartHandler = (id, category, restaurantName) => {
        category = encodeURIComponent(category)
        restaurantName = encodeURIComponent(restaurantName)
        
        try {
            async function addToCart() {
                const { data } = await axios.get(`/restaurant/cart/add-cart/${id}?category=${category}&restaurant_name=${restaurantName}`)
            }
            addToCart();
            toast.success("Item added to the Cart")
        } catch (error) {
            alert(error.response.data.message);
        }
    }

  return (
    <div className={Styles.container}>
      {data.map((restaurant, rIndex) => (
        <div key={rIndex} className={Styles.restaurantSection}>
          {restaurant.cuisines.map((cuisine, cIndex) => (
            <div key={cIndex} className={Styles.cuisineSection}>
              <h3 className={Styles.cuisineTitle}>{cuisine.category}</h3>

              <div className={Styles.foodScroll}>
                {cuisine.foods.map((food) => (
                  <div key={food._id} className={Styles.foodCard}>
                    <img
                      src={food.images[0]?.url}
                      alt={food.name}
                      className={Styles.foodImage}
                    />
                    <div className={Styles.foodDetails}>
                      <h4 className={Styles.foodName}>{food.name}</h4>
                      <p className={Styles.foodDesc}>{food.description}</p>
                      <p className={Styles.foodPrice}>₹ {food.price}</p>

                      <button className={Styles['add-to-cart-btn']}
                        onClick={() => addToCartHandler(food._id, cuisine.category, restaurant.restaurantName)}>
                        Add To Cart
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RestaurantCusinesFood;