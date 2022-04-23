import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { logout } from "../utils/auth";
import React from "react";
type LayoutProps = {
  children: React.ReactNode;
  isLogged: boolean;
};
const Layout = ({ children, isLogged }: LayoutProps) => {
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">SSM</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link
                onClick={isLogged ? logout : undefined}
                href={!isLogged ? "/auth" : undefined}
              >
                {isLogged ? "Singout" : "Signin"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {children}
    </div>
  );
};

export default Layout;
