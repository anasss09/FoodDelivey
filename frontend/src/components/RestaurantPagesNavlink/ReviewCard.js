import React, { useState } from "react";
import axios from '../../utils/axios'
import Styles from "./Reviews.module.css";
import { useSelector } from "react-redux";

const ReviewCard = ({ restaurant }) => {

    const userData = useSelector(state => state.userReducer)

    // Local state for reviews
    const [reviews, setReviews] = useState(restaurant.reviews || []);

    async function onDeleteBtnHandler(reviewId, restaurantName) {
        console.log(reviewId, restaurantName);

        try {
            await axios.get(`restaurant/delete-review/${reviewId}?restaurant_name=${restaurantName}`)

            // Update local state (remove deleted review)
            setReviews((prev) => prev.filter((item) => item._id !== reviewId));
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    // Helper: render stars
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                className={i < rating ? Styles.starFilled : Styles.starEmpty}
            >
                ★
            </span>
        ));
    };

    return (
        <>
            {reviews.map((item) => (
                <div key={item._id} className={Styles.reviewCard}>
                    <div className={Styles.reviewUserDetails}>
                        <img src={item.userImage} alt={item.username} className={Styles.reviewUserImage} />
                        <div className={Styles.reviewUserName} >{item.username}</div>

                        {userData.username === item.username && (

                            <button className={Styles.reviewDeleteBtn}
                                onClick={() => onDeleteBtnHandler(item._id, restaurant.name)}>
                                <i className="bi bi-trash3"></i>
                            </button>
                        )}
                    </div>

                    <div className={Styles.reviewRatingDetails} >
                        <div className={Styles.reviewStars} >{renderStars(item.rating)}</div>
                        <div className={Styles.reviewDate} >{new Date(restaurant.updatedAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata", day: "2-digit",
                            month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
                        })}
                        </div>
                    </div>

                    {item.images?.map((image) => (
                        <div key={image._id} className={Styles.reviewImageContainer}>
                            <img src={image.url} />
                        </div>
                    ))}

                    <div className={Styles.reviewMessage}>{item.message}</div>
                </div>
            ))}
        </>
    );
};

export default ReviewCard;
