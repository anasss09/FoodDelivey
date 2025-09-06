import React from "react";
import { useSelector } from "react-redux";
import Styles from "./Profile.module.css";

const Profile = () => {
  const userData = useSelector((state) => state.userReducer);

  return (
    <div className={Styles.profileContainer}>
      <div className={Styles.profileCard}>
        {/* Profile Image */}
        <div className={Styles.profileImage}>
          <img
            src={userData?.image}
            alt={userData?.name}
          />
        </div>

        {/* User Info */}
        <div className={Styles.profileInfo}>
          <h2 className={Styles.userName}>{userData?.username}</h2>
          <p className={Styles.name}><strong>Name:</strong> {userData?.name}</p>
          <p className={Styles.userEmail}><strong>Email:</strong> {userData?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
