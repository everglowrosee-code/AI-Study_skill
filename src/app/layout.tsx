import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오래 바라볼 두 개의 전시",
  description: "작품성과 미술사적 맥락을 중심으로 고른 서울의 전시 추천",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
