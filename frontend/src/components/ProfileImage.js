import React from "react";

const ProfileImage = (props) => {
  return (
    <img src={props.imageUrl} className="profile-image" alt="Profile" />
  );
};

export default ProfileImage;
