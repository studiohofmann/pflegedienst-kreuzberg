import Navigation from "./Navigation";

export default function Header() {
  return (
    <header>
      <Navigation />
      <img src="/logo.svg" alt="Logo" className="h-full w-auto" />
    </header>
  );
}
