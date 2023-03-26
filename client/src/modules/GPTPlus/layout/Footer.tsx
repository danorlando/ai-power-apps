import styles from "./styles.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <a
        href="https://github.com/danny-avila/chatgpt-clone"
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        ChatGPT+
      </a>
      . AI platforms and models all-in-one. Reliably serves and searches all conversations. Stack: React, Express, MongoDB, Prisma, AWS. 
    </div>
  );
}
