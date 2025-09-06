import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Styles from '../../pages/RestaurantPages/RestaurantPageItem.module.css';

const Photos = () => {
    const { restaurant } = useOutletContext();

    return (
        <div>
            <h4>Photos Section</h4>
            {restaurant.images?.length > 0 ? restaurant.images.map((photo, idx) => (
                <img key={idx} src={photo.url} alt={`photo-${idx}`} className={Styles['restaurant-photo']} />
            )) : <p>No photos available.</p>}
        </div>
    );
};

export default Photos;
