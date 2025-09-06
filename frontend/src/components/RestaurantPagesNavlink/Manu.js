import React from 'react';
import { useOutletContext } from 'react-router-dom';
import FoodItem from '../../components/FoodItems/FoodItem';
import Styles from '../../pages/RestaurantPages/RestaurantPageItem.module.css';

const Menu = () => {
    const { restaurant } = useOutletContext();

    return (
        <div>
            <h4>Menu Section</h4>
            {restaurant.cusines.map((item, indx) => (
                <div key={indx} className={Styles['menu-category']}>
                    <h5>{item.category}</h5>
                    {item.food.map((f, idx) => (
                        <FoodItem
                            key={idx}
                            food={f}
                            category={item.category}
                            restaurantName={restaurant.name}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Menu;
