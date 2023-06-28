import styles from "./AuthFormCard.module.scss";

interface AuthFormCardProps {
  title: string;
  children: React.ReactNode;
}

const AuthFormCard = ({ children, title }: AuthFormCardProps) => {
  return (
    <main className={styles["container"]}>
      <div className={styles["logo-container"]}>
        <img src="/images/brand/zerok_logo_light.svg" alt="zerok_logo" />
      </div>
      <h2>{title}</h2>
      {children}
    </main>
  );
};

export default AuthFormCard;
