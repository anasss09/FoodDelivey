import Styles from './FoodImageCarousel.module.css';

function RestaurantGallery({ images }) {
    // images[0] = big left image
    // images[1..3] = right small images
    
    return (
        <div className={Styles['gallery-container']}>
            {/* Left Big Image */}
            <div className={Styles['gallery-left']}>
                <img
                    src={images}
                    alt="Main"
                    className={Styles['big-image']}
                />
            </div>

            {/* Right Grid of Small Images */}
            {/* {images.length > 1 &&
            
            <div className={Styles['gallery-right']}>
                {images.slice(1, 4).map((img, idx) => (
                    <div key={idx} className={Styles['small-image-wrapper']}>
                        <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className={Styles['small-image']}
                        />
                        {idx === 2 && (
                            <div className={Styles['view-gallery-overlay']}>
                                View Gallery
                            </div>
                        )}
                    </div>
                ))}
            </div>

            } */}
        </div>
    );
}

export default RestaurantGallery;
