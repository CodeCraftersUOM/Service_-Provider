import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import styles from "./services.module.css"; // You will create this

export default function Services() {
  return (
    <div className={styles.container}>
      <LeftSection />
      <RightSection />
    </div>
  );
}
