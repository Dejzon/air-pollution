import React, { useState } from "react"
import { Button, Navbar } from "react-bootstrap"

import { useAuth } from "../context/AuthContext"
import { Link, useHistory } from "react-router-dom"

const Navigation = props => {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }
  return (

    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Air App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Link className="nav-link" exact="true" to="/current-air">Current Air</Link>
        <Link className="nav-link" exact="true" to="/forecast-air">Forecast Air</Link>
        <Link className="nav-link" exact="true" to="/">Dashboard</Link>
        <Link className="nav-link" exact="true" to="/location"> Location</Link>
        <Link className="nav-link" exact="true" to="/update-profile">Update Profile</Link>
        <Link className="nav-link" exact="true" to="/login">Log In</Link>
        <Link className="nav-link" exact="true" to="/signup">Sign Up</Link>
        <Link className="nav-link" exact="true" to="/forgot-password">Forgot Password</Link>
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>

      </Navbar.Collapse>
    </Navbar>

  );
};





export default Navigation;
