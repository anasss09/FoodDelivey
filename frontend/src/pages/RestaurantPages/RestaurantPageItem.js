import React, { useEffect, useState } from "react";
import Styles from "./RestaurantPageItem.module.css";
import { NavLink, Outlet } from "react-router-dom";

const RestaurantPageItem = ({ restaurant }) => {
  const [cusineCategory, setCusineCategory] = useState("");
  const [cusineFood, setCusineFood] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favoriteRestaurants") || "[]");
    setIsFavorite(favorites.some((favorite) => favorite.id === restaurant._id));
  }, [restaurant]);

  useEffect(() => {
    if (restaurant?.cusines?.length) setCusineCategory(restaurant.cusines[0].category);
  }, [restaurant]);

  useEffect(() => {
    const cuisine = restaurant.cusines?.find((item) => item.category === cusineCategory);
    setCusineFood(cuisine?.food || []);
  }, [cusineCategory, restaurant]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteRestaurants") || "[]");
    if (isFavorite) {
      localStorage.setItem("favoriteRestaurants", JSON.stringify(favorites.filter((favorite) => favorite.id !== restaurant._id)));
    } else {
      localStorage.setItem("favoriteRestaurants", JSON.stringify([...favorites, { id: restaurant._id, name: restaurant.name, image: restaurant.coverImage }]));
    }
    setIsFavorite(!isFavorite);
  };

  const shareRestaurant = (platform) => {
    const shareUrl = window.location.href;
    const text = `Check out ${restaurant.name} on Foodie!`;
    if (platform === "copy") navigator.clipboard.writeText(shareUrl);
    else window.open(platform === "whatsapp" ? `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}` : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  return (
    <main className={Styles.page}>
      <section className={Styles.hero}>
        <img src={restaurant.coverImage} alt={restaurant.name} className={Styles.heroImage} />
        <div className={Styles.heroShade}></div>
        <div className={Styles.heroInfo}>
          <span className={Styles.openBadge}>Open now</span>
          <div className={Styles.cuisineTags}>{restaurant.cusines?.slice(0, 4).map((item) => <span key={item.category}>{item.category}</span>)}</div>
          <h1>{restaurant.name}</h1>
          <p>📍 {restaurant.address} <b>·</b> ☎ {restaurant.contact}</p>
        </div>
      </section>

      <div className={Styles.quickActions}>
        <button className={`${Styles.actionButton} ${isFavorite ? Styles.favoriteActive : ""}`} onClick={toggleFavorite}>♥ {isFavorite ? "Saved" : "Save"}</button>
        <div className={Styles.shareContainer}>
          <button className={Styles.actionButton} onClick={() => setShowShareMenu(!showShareMenu)}>Share</button>
          {showShareMenu && <div className={Styles.shareMenu}><button onClick={() => shareRestaurant("facebook")}>Facebook</button><button onClick={() => shareRestaurant("whatsapp")}>WhatsApp</button><button onClick={() => shareRestaurant("copy")}>Copy link</button></div>}
        </div>
        <button className={Styles.actionButton} onClick={() => document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" })}>View menu</button>
      </div>

      <div className={Styles.content}>
        <div className={Styles.statsBar}>
          <div><strong>★ {restaurant.rating || "4.2"}</strong><span>Rating</span></div>
          <div><strong>{restaurant.deliveryTime || "25-35"}</strong><span>Minutes</span></div>
          <div><strong>₹{restaurant.costForTwo || "500"}</strong><span>Cost for two</span></div>
          <div><strong>{restaurant.cusines?.length || 0}</strong><span>Categories</span></div>
        </div>

        <nav className={Styles.tabs}>
          <NavLink to="" end className={({ isActive }) => `${Styles.tab} ${isActive ? Styles.activeTab : ""}`}>Overview</NavLink>
          <NavLink to="reviews" className={({ isActive }) => `${Styles.tab} ${isActive ? Styles.activeTab : ""}`}>Reviews</NavLink>
          <NavLink to="photos" className={({ isActive }) => `${Styles.tab} ${isActive ? Styles.activeTab : ""}`}>Photos</NavLink>
          <NavLink to="menu" className={({ isActive }) => `${Styles.tab} ${isActive ? Styles.activeTab : ""}`}>Full menu</NavLink>
        </nav>

        <div id="menu-section" className={Styles.tabContent}>
          <Outlet context={{ restaurant, cusineCategory, cusineFood, setCusineCategory }} />
        </div>
      </div>
    </main>
  );
};

export default RestaurantPageItem;
