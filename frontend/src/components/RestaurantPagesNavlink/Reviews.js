import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { FormRestaurantReview } from "./FormRestaurantReview";
import ReviewCard from "./ReviewCard";
import ReviewEmptyPage from "./ReviewEmptyPage";


const Reviews = () => {
  const userData = useSelector((state) => state.userReducer);
  const { restaurant } = useOutletContext();

  const [reviews, setReviews] = useState(restaurant?.reviews || []);

  const addReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div>
      {userData?.orderHistory?.length > 0 && (
        <FormRestaurantReview restaurant={restaurant} onAddReview={addReview} />
      )}

      {reviews?.length > 0 ? (
        <ReviewCard restaurant={{...restaurant, reviews }} />
      ) : (
        <ReviewEmptyPage />
      )}

      <br /><br /><br /><br /><br /><br /><br />
    </div>
  );
};

export default Reviews;
