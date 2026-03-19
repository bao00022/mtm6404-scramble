# note

I plan to use Tailwind to implement the CSS.

Because the latest version of create-vite (9.0.2) uses Vite 8.0, it throws an error when integrating Tailwind, so I used create-vite (8.3.0) for instead.

React part mainly uses useState and useEffect. useEffect is primarily needed when dealing with localStorage operations, while useState is used extensively when implementing app functionality.

## React + Vite + tailwind installation note

```bash
npm create vite@8.3.0 ./
npm install
npm install tailwindcss @tailwindcss/vite
npm run dev
```
