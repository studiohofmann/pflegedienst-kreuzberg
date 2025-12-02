// app/site/layout.tsx
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import "../globals.css"; // falls du globale Styles einbeziehen willst

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
