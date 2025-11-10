import "./globals.css";
import Layout from "../components/Layout";

export const metadata = {
  title: "Hub Study",
  description: "Organize seus estudos e não perca nenhum prazo!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
