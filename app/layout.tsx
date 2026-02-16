import "./globals.css";

export const metadata = {
  title: "Vivido Social",
  description: "Chat em tempo real",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}