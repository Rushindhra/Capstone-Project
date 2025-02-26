import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { userAuthorContextObj } from "../../contexts/userAuthorContext";
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa6";
function Home() {
  // Get the current user context
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);

  // Clerk's useUser hook to get authentication status and user info
  const { isSignedIn, user, isLoaded } = useUser();

  // State to track errors
  const [error, setError] = useState("");

  // Navigation hook
  const navigate = useNavigate();

  // Function to handle role selection
  async function onSelectRole(e) {
    // Clear previous error message
    setError("");

    // Get the selected role
    const selectedRole = e.target.value;

    // Ensure currentUser exists before updating
    if (!currentUser) {
      console.error("Current user is undefined.");
      return;
    }

    // Create a copy of currentUser to avoid direct mutation
    const updatedUser = { ...currentUser, role: selectedRole };

    let res = null;

    try {
      if (selectedRole === "author") {
        res = await axios.post("http://localhost:3000/author-api/author", updatedUser);
      } else if (selectedRole === "user") {
        res = await axios.post("http://localhost:3000/user-api/user", updatedUser);
      } else if (selectedRole === "admin") {
        res = await axios.post("http://localhost:3000/admin-api/admin", updatedUser);
      } else {
        // If an invalid role is selected, set error and return early
        setError("Invalid role selected.");
        return;
      }

      // Extract response data
      const { message, payload } = res.data;

      // Handle response based on role and active status
      if (message === selectedRole) {
        if (payload.isActive === true) {
          setCurrentUser({ ...updatedUser, ...payload });
        } else {
          setError("You are blocked by the admin, please contact support.");
        }
      } else {
        setError(message);
      }
    } catch (error) {
      console.error("Error during role selection:", error);
      setError("Something went wrong. Please try again.");
    }
  }

  // Set the current user details when the user is signed in
  useEffect(() => {
    if (isSignedIn && user) {
      setCurrentUser((prevUser) => ({
        ...prevUser,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.emailAddresses?.[0]?.emailAddress,
        profileImageUrl: user?.imageUrl,
      }));
    }
  }, [isLoaded, user, isSignedIn]);

  // Navigate to the respective profile page after selecting a role
  useEffect(() => {
    if (currentUser?.role && error.length === 0) {
      if (currentUser.role === "user" && currentUser.isActive === true) {
        navigate(`/user-profile/${currentUser.email}`);
      } else if (currentUser.role === "author" ) {
        navigate(`/author-profile/${currentUser.email}`);
      } else if (currentUser.role === "admin") {
        navigate(`/admin-profile/${currentUser.email}`);
      }
    }
  }, [currentUser?.role]);

  return (
    <div className="container">
      {/* If the user is not signed in, show placeholder text */}
      {isSignedIn === false && (
        <div>
          <div className="lead">
            <h1 className="">Welcome, to Capstone Project.</h1>
            <p className="text-secondary d-flex align-items-center gap-2 m-0">
                Please click on Signin to continue  
              <Link to="/signin">
              <button type="button" className="btn btn-primary px-2 py-1">Signin <FaArrowRight /></button>
                </Link>
              </p>
              <br></br>
            <h2>Project Overview</h2>
            <p>This project is a content management system where authors can post articles, users can read and comment on them, and admins can manage users and content moderation</p>
            <br></br>
            <img src="https://moneypath.securefutures.org/wp-content/uploads/2024/04/Money-Path-blog-landscape.png" className="img-fluid" alt="" />
          </div>
        </div>
      )}

      {/* If the user is signed in, show profile details and role selection */}
      {isSignedIn === true && (
        <div>
          {/* Profile Display */}
          <div className="d-flex justify-content-evenly role-radio align-items-center background-card p-3">
            <img src={user.imageUrl} width="100px" className="rounded-circle" alt="Profile" />
            <p className="display-6">{user.firstName}</p>
            <p className="lead text-secondary">{user.emailAddresses[0].emailAddress}</p>
          </div>

          <p className="lead">Select your role:</p>

          {/* Display error message if any */}
          {error?.length !== 0 && (
            <p className="text-danger fs-5" style={{ fontFamily: "sans-serif" }}>
              Invalid role. {error}
            </p>
          )}

          {/* Role selection radio buttons */}
          <div className="d-flex role-radio py-3 justify-content-around">
            <div className="form-check me-4">
              <input
                type="radio"
                name="role"
                value="author"
                id="author"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label htmlFor="author" className="form-check-label">Author</label>
            </div>

            <div className="form-check me-4">
              <input
                type="radio"
                name="role"
                value="user"
                id="user"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label htmlFor="user" className="form-check-label">User</label>
            </div>

            <div className="form-check">
              <input
                type="radio"
                name="role"
                value="admin"
                id="admin"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label htmlFor="admin" className="form-check-label">Admin</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
