import React from "react";
import { useSelector } from "react-redux";
import Styles from "./Profile.module.css";

const Profile = () => {
  const userData = useSelector((state) => state.userReducer);

  return (
    <main className={Styles.profileContainer}>
      <div className={Styles.profileHero}><span>Your Foodie account</span><h1>Good to see you,<br /><em>{userData?.name?.split(" ")[0] || "friend"}.</em></h1><p>Your details, favorites, and delivery journey all live here.</p></div>
      <div className={Styles.profileCard}>
        <div className={Styles.profileImage}><img src={userData?.image} alt={userData?.name || "Profile"} /><span>Foodie member</span></div>
        <div className={Styles.profileInfo}>
          <p className={Styles.label}>Profile</p>
          <h2 className={Styles.userName}>{userData?.username}</h2>
          <div className={Styles.details}><div><span>Full name</span><p>{userData?.name || "Not provided"}</p></div><div><span>Email address</span><p>{userData?.email || "Not provided"}</p></div></div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
