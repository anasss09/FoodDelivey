import Carousel from 'react-bootstrap/Carousel';
import Styles from './FoodImage.module.css';
import phoneIcon from '../../assets/phone.png';

function DarkVariantExample({ name, address, imageUrl, contact, cusines }) {
    return (
        <div className={Styles['restaurant-header']}>


            {/* Restaurant Info */}
            <h1 className={Styles['restaurant-name']}>{name}</h1>

            <div className={Styles['restaurant-cusines']}>
                {cusines.map((item, indx) => (
                    <span key={indx} className={Styles['cusine-tag']}>
                        {item.category}
                        {indx < cusines.length - 1 && ','}&nbsp;
                    </span>
                ))}
            </div>

            <div className={Styles['restaurant-address']}>{address}</div>

            <div className={Styles['restaurant-contact']}>
                <img
                    className={Styles['icon-phone']}
                    src={phoneIcon}
                    alt="Phone Icon"
                />
                <span className={Styles['contact-text']}>{contact}</span>
            </div>

            {/* Image */}
            <div className={Styles['gallery-container']}>
                <div className={Styles['gallery-left']}>
                    <img
                        src={imageUrl}
                        alt="Restaurant Cover Image"
                        className='img-fluid'
                    />
                </div>
            </div>


        </div>
    );
}

export default DarkVariantExample;




// import Carousel from 'react-bootstrap/Carousel';
// import Styles from './FoodImageCarousel.module.css';
// import phoneIcon from '../components/assets/images/phone.png'

// function DarkVariantExample({ name, address, imageUrl, contact, cusines }) {
//     return (
//         <>

//         <h1 className='capitalize'>{name}</h1>
//         {cusines.map((item, indx) => <span key={indx} className='capitalize'>{item.category}&nbsp;</span>)}
//         <div className='capitalize'>{address}</div>
//         <div ><span>{<img className={Styles['icon-phone']} src={phoneIcon} alt='Phone Icon'/>}</span>{contact}</div>
//         <Carousel data-bs-theme="dark">
//             <Carousel.Item>
//                 <center>
//                     <img
//                         className={`d-block w-90 ${Styles['carousel-image']}`}
//                         src={imageUrl}
//                         alt="First slide"
//                     />
//                 </center>
//             </Carousel.Item>
//         </Carousel>
//         </>
//     );
// }

// export default DarkVariantExample;