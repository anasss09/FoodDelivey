import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import McDonals from '../assets/McDonals.avif'
import Dominos from '../assets/Dominos.png'
import BurgerKing from '../assets/BergerKing.avif'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Styles from "./LandingPage.module.css";

const LandingPage = () => {
  const userData = useSelector(state => state.userReducer)
  return (
    <>
      {!userData.isLoggedIn && (
        <main className={Styles.page}>
          <section className={Styles.hero}>
            <Container className={Styles.heroInner}>
              <div className={Styles.heroCopy}>
                <span className={Styles.eyebrow}><span></span> Serving good days</span>
                <h1>Food worth <em>leaving</em> the sofa for.</h1>
                <p>From local favorites to late-night cravings, discover a better way to eat at home.</p>
                <div className={Styles.actions}>
                  <Link to="/signup" className={Styles.primaryAction}>Start ordering <span>→</span></Link>
                  <a href="#favorites" className={Styles.secondaryAction}>Explore restaurants</a>
                </div>
                <div className={Styles.trustRow}>
                  <div className={Styles.avatars}><b>J</b><b>M</b><b>A</b></div>
                  <p><strong>20k+</strong> hungry neighbors<br />already ordering with Foodie</p>
                </div>
              </div>
              <div className={Styles.heroVisual}>
                <div className={Styles.heroGlow}></div>
                <div className={Styles.mainDish}><img src={BurgerKing} alt="A freshly made burger" /></div>
                <div className={Styles.deliveryNote}><span>⚡</span><div><strong>Under 30 minutes</strong><small>Hot food, zero waiting</small></div></div>
                <div className={Styles.rating}><strong>4.9</strong><span>★★★★★</span><small>from food lovers</small></div>
                <div className={Styles.orbitOne}></div><div className={Styles.orbitTwo}></div>
              </div>
            </Container>
          </section>

          <section className={Styles.features}>
            <Container><Row>
              <Col md={4}><div className={Styles.feature}><span>01</span><div><h3>Picked for you</h3><p>Real neighborhood restaurants, all in one delicious place.</p></div></div></Col>
              <Col md={4}><div className={Styles.feature}><span>02</span><div><h3>Fresh from the kitchen</h3><p>We send your order out when it is ready, not a moment sooner.</p></div></div></Col>
              <Col md={4}><div className={Styles.feature}><span>03</span><div><h3>Easy from start to finish</h3><p>Simple ordering, clear updates, and the payment that suits you.</p></div></div></Col>
            </Row></Container>
          </section>

          <section id="favorites" className={Styles.favorites}>
            <Container>
              <div className={Styles.sectionHeading}><div><span className={Styles.eyebrow}>Neighborhood favorites</span><h2>A little something for every mood.</h2></div><Link to="/signup">See all restaurants <span>→</span></Link></div>
              <Row className="g-4">
                {[
                  ["McDonald's", "American classics · 20–30 min", McDonals, "#f4cf44"],
                  ["Domino's", "Pizza night · 25–35 min", Dominos, "#e9ddd0"],
                  ["Burger King", "Flame grilled · 20–30 min", BurgerKing, "#f4b78e"],
                ].map(([name, detail, image, color]) => <Col md={4} key={name}><article className={Styles.restaurantCard}><div className={Styles.cardImage} style={{ backgroundColor: color }}><img src={image} alt={name} /><span>Open now</span></div><div className={Styles.cardBody}><div><h3>{name}</h3><p>{detail}</p></div><button aria-label={`View ${name}`}>↗</button></div></article></Col>)}
              </Row>
            </Container>
          </section>

          <section className={Styles.cta}><Container><div><span className={Styles.eyebrow}>Your table is waiting</span><h2>Make tonight<br /><em>taste better.</em></h2></div><Link to="/signup" className={Styles.lightAction}>Find your next meal <span>→</span></Link></Container></section>

          <footer className={Styles.footer}><Container><span>Foodie</span><p>Good food, delivered with care.</p><small>© 2026 Foodie. All rights reserved.</small></Container></footer>
        </main>
      )}
    </>
  );
};

export default LandingPage;
