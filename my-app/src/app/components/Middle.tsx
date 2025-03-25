import Image from "next/image";
import Link from "next/link";
import styles from "./MIddle.module.css"

const Middle = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.txt}>Travel Wish 
        <br />
      <span className={styles.subText}>Your Passport to Adventure
      </span>
      </h1>
    </div>

 

);
};

export default Middle;