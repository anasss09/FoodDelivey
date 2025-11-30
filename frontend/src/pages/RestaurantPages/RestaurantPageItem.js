import React, { useEffect, useState } from 'react';
import FoodImageCarousel from "../../components/FoodItems/FoodImage";
import Styles from "./RestaurantPageItem.module.css";
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const RestaurantPageItem = ({ restaurant }) => {
  const [cusineCategory, setCusineCategory] = useState("");
  const [cusineFood, setCusineFood] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const location = useLocation();

  // Check if restaurant is in favorites
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRestaurants') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === restaurant.id));
  }, [restaurant]);

  // Set default category when restaurant changes
  useEffect(() => {
    if (restaurant?.cusines?.length > 0) {
      setCusineCategory(restaurant.cusines[0].category);
      setCusineFood(restaurant.cusines[0].food);
    }
  }, [restaurant]);

  // Update food when category changes
  useEffect(() => {
    if (cusineCategory) {
      const food = restaurant.cusines.find(item => item.category === cusineCategory);
      if (food) setCusineFood(food.food);
    }
  }, [cusineCategory, restaurant]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRestaurants') || '[]');
    
    if (isFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== restaurant.id);
      localStorage.setItem('favoriteRestaurants', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      const updatedFavorites = [...favorites, {
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.coverImage,
        rating: restaurant.rating
      }];
      localStorage.setItem('favoriteRestaurants', JSON.stringify(updatedFavorites));
      setIsFavorite(true);
    }
  };

  const shareRestaurant = (platform) => {
    const shareUrl = window.location.href;
    const text = `Check out ${restaurant.name} on FoodApp!`;
    
    const shareData = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      copy: shareUrl
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareData[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={Styles['restaurant-item-page-fix']}>
      {/* Quick Actions Bar */}
      <div className={Styles['quick-actions']}>
        <button 
          className={`${Styles['action-btn']} ${isFavorite ? Styles['favorite-active'] : ''}`}
          onClick={toggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ♥ {isFavorite ? 'Saved' : 'Save'}
        </button>
        
        <div className={Styles['share-container']}>
          <button 
            className={Styles['action-btn']}
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            Share
          </button>
          {showShareMenu && (
            <div className={Styles['share-menu']}>
              <button onClick={() => shareRestaurant('facebook')}>Facebook</button>
              <button onClick={() => shareRestaurant('twitter')}>Twitter</button>
              <button onClick={() => shareRestaurant('whatsapp')}>WhatsApp</button>
              <button onClick={() => shareRestaurant('copy')}>Copy Link</button>
            </div>
          )}
        </div>

        <button 
          className={Styles['action-btn']}
          onClick={() => scrollToSection('menu-section')}
        >
          View Menu
        </button>
      </div>

      <div className={Styles['carousel']}>
        <FoodImageCarousel
          address={restaurant.address}
          imageUrl={restaurant.coverImage}
          name={restaurant.name}
          contact={restaurant.contact}
          cusines={restaurant.cusines}
          rating={restaurant.rating}
          deliveryTime={restaurant.deliveryTime}
        />

        {/* Interactive Stats Bar */}
        <div className={Styles['stats-bar']}>
          <div className={Styles['stat-item']}>
            <span className={Styles['stat-value']}>{restaurant.rating || '4.2'}</span>
            <span className={Styles['stat-label']}>Rating</span>
          </div>
          <div className={Styles['stat-item']}>
            <span className={Styles['stat-value']}>{restaurant.deliveryTime || '25-35'}</span>
            <span className={Styles['stat-label']}>Mins</span>
          </div>
          <div className={Styles['stat-item']}>
            <span className={Styles['stat-value']}>₹{restaurant.costForTwo || '500'}</span>
            <span className={Styles['stat-label']}>Cost for two</span>
          </div>
          <div className={Styles['stat-item']}>
            <span className={Styles['stat-value']}>{restaurant.cusines?.length || 0}</span>
            <span className={Styles['stat-label']}>Categories</span>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className={Styles['tabs-container']}>
          <NavLink to="" end className={({ isActive }) =>
            `${Styles['tab-item']} ${isActive ? Styles['active-tab'] : ""}`
          }>
            <i className={Styles['tab-icon']}>📖</i> Overview
          </NavLink>

          <NavLink to="reviews" className={({ isActive }) =>
            `${Styles['tab-item']} ${isActive ? Styles['active-tab'] : ""}`
          }>
            <i className={Styles['tab-icon']}>⭐</i> Reviews
          </NavLink>

          <NavLink to="photos" className={({ isActive }) =>
            `${Styles['tab-item']} ${isActive ? Styles['active-tab'] : ""}`
          }>
            <i className={Styles['tab-icon']}>📷</i> Photos
          </NavLink>

          <NavLink to="menu" className={({ isActive }) =>
            `${Styles['tab-item']} ${isActive ? Styles['active-tab'] : ""}`
          }>
            <i className={Styles['tab-icon']}>🍽️</i> Menu
          </NavLink>
        </div>

        {/* Progress indicator */}
        <div className={Styles['tab-progress']}>
          <div 
            className={Styles['progress-bar']}
            style={{
              width: 
                location.pathname.endsWith('/reviews') ? '75%' :
                location.pathname.endsWith('/photos') ? '50%' :
                location.pathname.endsWith('/menu') ? '100%' : '25%'
            }}
          ></div>
        </div>

        {/* Outlet will render the tab content */}
        <div className={Styles['tab-content']}>
          <Outlet
            context={{ restaurant, cusineCategory, cusineFood, setCusineCategory }}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantPageItem;