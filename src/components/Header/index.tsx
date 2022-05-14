import styles from './header.module.scss';
import Link from 'next/link';

export default function Header() {
  return (
    <Link href="/">
      <header className={styles.headerContainer}>
        <img src="/images/logo.svg" alt="logo" />
      </header>
    </Link>
  )
}
