import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "sandbox / froura.ai",
  description: "safe financial systems for AI agent driven digital commerce.",
  metadataBase: new URL("https://sandbox.froura.ai/"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
