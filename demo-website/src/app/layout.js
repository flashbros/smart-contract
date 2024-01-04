import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content="Web3 Test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Web3 Test</title>
      </head>
      <body>{children}</body>
    </html>
  );
}