import "./globals.css";

export const metadata = {
  title: "MFA",
};

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
