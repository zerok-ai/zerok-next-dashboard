import styles from "./AuthFormCard.module.scss";

interface AuthFormCardProps {
  title: string;
  children: React.ReactNode;
}

const AuthFormCard = ({ children, title }: AuthFormCardProps) => {
  return (
    <main className={styles.container}>
      <figure className={styles["logo-container"]}>
        <img src="/images/brand/zerok_logo_light.svg" alt="zerok_logo" />
      </figure>
      <h4>{title}</h4>
      {children}
    </main>
  );
};

export default AuthFormCard;
