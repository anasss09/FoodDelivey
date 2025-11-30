import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";
import RestaurantPageItem from "./RestaurantPageItem";
import MySpinner from "../../components/Spinner";

const RestaurantPage = () => {
  const { restaurant_id } = useParams();
  const [isRestaurantFetched, setIsRestaurantFetched] = useState(false);
  const [restaurant, setRestaurant] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRestaurant = async () => {
      try {
        const { data } = await axios.get(`/restaurant/${restaurant_id}`);
        setRestaurant(data.restaurant[0]);
        setIsRestaurantFetched(true);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load restaurant");
        console.error("Error fetching restaurant:", error);
      }
    };
    getRestaurant();
  }, [restaurant_id]);

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isRestaurantFetched && <RestaurantPageItem restaurant={restaurant} />}
      {!isRestaurantFetched && !error && <MySpinner />}
    </>
  );
};

export default RestaurantPage;