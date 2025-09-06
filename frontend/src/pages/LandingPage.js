import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import McDonals from '../assets/McDonals.avif'
import Dominos from '../assets/Dominos.png'
import BurgerKing from '../assets/BergerKing.avif'
import { useSelector } from "react-redux";

const LandingPage = () => {
  const userData = useSelector(state => state.userReducer)
  return (
    <>
      {!userData.isLoggedIn && (
        <div>

          {/* Hero Section */}
          <section className="bg-light text-center py-5">
            <Container>
              <h1 className="display-4 fw-bold">Delicious Food, Delivered Fast 🚀</h1>
              <p className="lead">
                Order from your favorite restaurants and get it delivered at your doorstep.
              </p>
            </Container>
          </section>

          {/* Features */}
          <section className="py-5">
            <Container>
              <Row className="text-center">
                <Col md={4}>
                  <h3>⚡ Fast Delivery</h3>
                  <p>Get your food delivered in less than 30 minutes.</p>
                </Col>
                <Col md={4}>
                  <h3>🥗 Fresh & Healthy</h3>
                  <p>We partner with the best restaurants in town.</p>
                </Col>
                <Col md={4}>
                  <h3>💳 Easy Payment</h3>
                  <p>Pay online or cash on delivery, your choice.</p>
                </Col>
              </Row>
            </Container>
          </section>

          {/* Popular Restaurants */}
          <section className="bg-light py-5">
            <Container >
              <h2 className="text-center mb-4">Popular Restaurants 🍔</h2>

              <Row className="justify-content-around">
                <Col md={4}>
                  <Card className="mb-4 shadow-sm">
                    <Card.Img variant="top" src={McDonals} style={{ height: "200px", objectFit: "cover" }} />
                    <Card.Body>
                      <Card.Title>McDonals</Card.Title>
                      <Card.Text>
                        Tasty meals from the best chefs. Order now and enjoy hot food delivered.
                      </Card.Text>
                      <Button variant="primary">View Menu</Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card className="mb-4 shadow-sm">
                    <Card.Img variant="top" src={Dominos} style={{ height: "200px", objectFit: "contain" }} />
                    <Card.Body>
                      <Card.Title>Dominos</Card.Title>
                      <Card.Text>
                        Tasty meals from the best chefs. Order now and enjoy hot food delivered.
                      </Card.Text>
                      <Button variant="primary">View Menu</Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card className="mb-4 shadow-sm">
                    <Card.Img variant="top" src={BurgerKing} style={{ height: "200px", objectFit: "cover" }} />
                    <Card.Body>
                      <Card.Title>Burger King</Card.Title>
                      <Card.Text>
                        Tasty meals from the best chefs. Order now and enjoy hot food delivered.
                      </Card.Text>
                      <Button variant="primary">View Menu</Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>

          {/* Call to Action */}
          <section className="text-center py-5">
            <Container>
              <h2>Download the FoodieExpress App 📱</h2>
              <p>Order food anytime, anywhere with our mobile app.</p>
              <Button variant="dark" className="me-2">
                App Store
              </Button>
              <Button variant="dark">Google Play</Button>
            </Container>
          </section>

          {/* Footer */}
          <footer className="bg-dark text-white text-center py-3">
            <Container>
              <p>© 2025 FoodieExpress. All rights reserved.</p>
            </Container>
          </footer>
        </div>
      )}
    </>
  );
};

export default LandingPage;
