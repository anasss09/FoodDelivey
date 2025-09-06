import React, { useRef, useState } from "react";
import axios from "../../utils/axios";
import Styles from "./Reviews.module.css";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";


export const FormRestaurantReview = ({ restaurant, onAddReview }) => {

    const messagereviewRef = useRef();
    const imageRef = useRef();

    const [selectedImages, setSelectedImages] = useState([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const [rating, setRating] = useState(1);
    const [hover, setHover] = useState(0);


    function handleImageChange(e) {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
    }

    async function onSubmitHandler(ev) {
        ev.preventDefault();

        try {

            setLoading(true);
            setProgress(0);

            const formData = new FormData();
            formData.append("rating", rating);
            formData.append("message", messagereviewRef.current.value);
            formData.append('restaurant_name', restaurant.name)

            if (imageRef.current.files[0]) {
                selectedImages.forEach((img) => {
                    formData.append("images", img);
                });
                // formData.append("images", imageRef.current.files[0]);
            }

            const res = await axios.post(
                `restaurant/add-review`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percent);
                    },
                });

            if (onAddReview) {
                onAddReview(res.data);
            }
            setRating(1)
        } catch (error) {
            console.error("❌ Failed to submit review:", error);
            alert("Something went wrong while submitting review.");
        } finally {
            setLoading(false);
            setProgress(0);
            setSelectedImages([]);
            if (imageRef.current) imageRef.current.value = null;
            if (messagereviewRef.current) messagereviewRef.current.value = "";
        }
    }

    return (
        <div>
            <div className={Styles.reviewsContainer}>
                <div className={Styles.reviewsSubContainer}>
                    <div className={Styles.reviewsRestaurantName}>
                        Add reviews to&nbsp;
                        <span className={Styles.reviewsRestaurantNameSpan}>
                            {restaurant.name}
                        </span>
                    </div>

                    <form onSubmit={onSubmitHandler}>
                        {/* ⭐ Star Rating */}
                        <div
                            style={{
                                display: "flex",
                                marginBottom: "1rem",
                                fontSize: "2.5rem",
                                cursor: "pointer",
                                gap: "0.5rem",
                            }}
                        >
                            {[...Array(5)].map((star, index) => {
                                index += 1;
                                return (
                                    <span
                                        key={index}
                                        style={{
                                            color: index <= (hover || rating) ? "#ffc107" : "#e4e5e9",
                                        }}
                                        onClick={() => setRating(index)}
                                        onMouseEnter={() => setHover(index)}
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        ★
                                    </span>
                                );
                            })}
                        </div>

                        {/* 📂 File Upload */}
                        <div className={Styles.fileInputText}>
                            <div style={{ marginBottom: "1rem" }}>
                                <input
                                    type="file"
                                    ref={imageRef}
                                    id="uploadFile"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    multiple
                                />
                                <label
                                    htmlFor="uploadFile"
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "1.0rem",
                                    }}
                                >
                                    <i className="bi bi-upload"></i> Upload Image
                                </label>

                                {selectedImages.length > 0 &&
                                    selectedImages.map((img, idx) => (
                                        <span key={idx} style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
                                            {img.name}
                                        </span>
                                    ))}

                            </div>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write your review..."
                                ref={messagereviewRef}
                                className="mb-3"
                            />
                        </div>

                        {/* ⏳ Upload Progress */}
                        {loading && (
                            <div style={{ marginBottom: "1rem" }}>
                                <ProgressBar
                                    animated
                                    now={progress}
                                    label={`${progress}%`}
                                    variant="success"
                                />
                            </div>
                        )}


                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
