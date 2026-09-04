import React, { useEffect, useRef, useState } from "react";
import Styles from "./RestaurantCusinesFood.module.css";
import axios from '../../utils/axios'
import { toast } from "react-toastify";

const RestaurantCusinesFood = ({ data, selectedCategory }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const sectionRef = useRef(null);
	const pageSize = 8;
	const cuisineSections = data.flatMap((restaurant) => (restaurant.cuisines || []).map((cuisine) => ({ ...cuisine, restaurantName: restaurant.restaurantName })));
	const filteredSections = cuisineSections.filter((cuisine) => selectedCategory === "all" || cuisine.category === selectedCategory);
	const totalPages = Math.max(1, Math.ceil(filteredSections.length / pageSize));
	const visibleSections = filteredSections.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	useEffect(() => { setCurrentPage(1); }, [selectedCategory]);
	const goToPage = (page) => {
		setCurrentPage(page);
		sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

   const addToCartHandler = async (id, category, restaurantName) => {
        category = encodeURIComponent(category)
        restaurantName = encodeURIComponent(restaurantName)
        
        try {
            await axios.get(`/restaurant/cart/add-cart/${id}?category=${category}&restaurant_name=${restaurantName}`)
            toast.success("Item added to the Cart")
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not add this item to cart.");
        }
    }

  return (
    <div ref={sectionRef} className={Styles.container}>
      {visibleSections.map((cuisine, index) => (
            <div key={`${cuisine.restaurantName}-${cuisine.category}-${index}`} className={Styles.cuisineSection}>
              <div className={Styles.titleRow}><div><span>Freshly prepared</span><h3 className={Styles.cuisineTitle}>{cuisine.category}</h3></div><p>Swipe to explore →</p></div>

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
                      <div className={Styles.foodFooter}><p className={Styles.foodPrice}>₹ {food.price}</p><button className={Styles['add-to-cart-btn']}
                        onClick={() => addToCartHandler(food._id, cuisine.category, cuisine.restaurantName)}>
                        Add <span>+</span>
                      </button></div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
      ))}
      {!filteredSections.length && <div className={Styles.emptyCategory}>We are adding more <strong>{selectedCategory}</strong> dishes soon. Try another craving.</div>}
      {totalPages > 1 && <div className={Styles.foodPagination}><button onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>← Previous</button><span>Showing cuisines {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredSections.length)} of {filteredSections.length}</span><button onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next 8 →</button></div>}
    </div>
  );
};

export default RestaurantCusinesFood;
