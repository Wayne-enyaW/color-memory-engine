import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><p className="eyebrow">404</p><h1>That color trail has expired.</h1><p>Short challenges last seven days. Long challenge links remain self-contained.</p><Link className="primary-button" href="/">Play a new round</Link></main>;
}
