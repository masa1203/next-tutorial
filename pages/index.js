import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="title">Welcome!</h1>
      <Link href="/posts/first-post">
        <a>Link to first-post</a>
      </Link>
    </>
  );
}
