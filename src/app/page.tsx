import Link from "next/link";
import styles from "./page.module.css";

export default function AcceuilPage() {
  return (
    <div className={styles.containerPage}>
      <img
        className={styles.logo}
        src="/Logo/Gemini_Generated_Image_z3en94z3en94z3en.png"
        alt="Sekai Kakute Taikai"
      />
      <ul>
        <li className={styles.buttonFighters}>
          <Link href="/fighters">Start</Link>
        </li>
      </ul>
    </div>
  );
}
