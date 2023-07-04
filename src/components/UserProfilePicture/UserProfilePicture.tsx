import styles from "./UserProfilePicture.module.scss";

interface UserProfilePictureProps {
  name: string;
}

const UserProfilePicture = ({ name }: UserProfilePictureProps) => {
  const displayString = name.trim()
    ? name
        .split(" ")
        .map((word) => {
          console.log({ word });
          return word[0];
        })
        .join("")
    : "AD";
  return <div className={styles["container"]}>{displayString}</div>;
};

export default UserProfilePicture;
