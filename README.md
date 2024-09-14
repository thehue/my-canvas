This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 중요 내용 핵심 정리
### 1.1.1 <canvas> 요소의 크기와 드로잉 표면 [커밋: d2bd019a](https://github.com/thehue/my-canvas/commit/d2bd019a98dfd75ecbe0d5c38578a9acea4b401a)
- css를 사용해 <canvas> 요소의 크기를 설정한다면, <canvas> 요소의 크기는 캔버스의 드로잉 표면 크기와 일치하지 않게 되며(요소의 크기가 설정되어 있다면 그 크기로 따라가고 아니면 default값인 300 x 150), 브라우저에서는 <canvas> 요소의 크기를 맞추기 위해 드로잉 표면의 크기를 변경하므로 원치 않은 효과를 야기할 수 있다.
- 아래 예시 참고
<img width="492" alt="image" src="https://github.com/user-attachments/assets/cd4c105b-e828-4448-bbc7-a7429368afd3">


