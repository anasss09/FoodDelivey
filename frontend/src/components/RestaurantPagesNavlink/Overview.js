import React from 'react';
import { useOutletContext } from 'react-router-dom';
import FoodItem from '../../components/FoodItems/FoodItem';
import Styles from '../../pages/RestaurantPages/RestaurantPageItem.module.css';

const Overview = () => {
    const { restaurant, cusineCategory, cusineFood, setCusineCategory } = useOutletContext();

    const handleCategoryClick = (category) => setCusineCategory(category);

    return (
        <div className='cusines-container'>
            <div className={Styles['cusines']}>
                <div className={Styles['cusines-category']}>
                    {restaurant.cusines.map((item, indx) =>
                        <div
                            key={indx}
                            className={`${Styles['cusines-category-item']} ${item.category === cusineCategory ? Styles['active-category'] : ""}`}
                            onClick={() => handleCategoryClick(item.category)}
                        >
                            {item.category}
                        </div>
                    )}
                </div>

                <div className={Styles['cusines-food']}>
                    {cusineFood.length > 0 ? cusineFood.map((item, indx) =>
                        <div key={indx} className={Styles['cusines']}>
                            <FoodItem
                                food={item}
                                category={cusineCategory}
                                restaurantName={restaurant.name}
                            />
                        </div>
                    ) : <div className={Styles['cusines']}>No Food under this category</div>}
                </div>
            </div>
        </div>
    );
};

export default Overview;
