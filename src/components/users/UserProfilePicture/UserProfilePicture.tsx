import styles from "./UserProfilePicture.module.scss";

interface UserProfilePictureProps {
  name: string;
}

const UserProfilePicture = ({ name }: UserProfilePictureProps) => {
  const displayString = name.trim()
    ? name
        .split(" ")
        .slice(0, 2)
        .map((word) => {
          if (!word) return "";
          return word[0].toLocaleUpperCase();
        })
        .join("")
    : "AD";
  return <div className={styles.container}>{displayString}</div>;
};

export default UserProfilePicture;
