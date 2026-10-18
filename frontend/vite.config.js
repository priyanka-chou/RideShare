import react from '@vitejs/plugin-react'  // ye vite ko react ke sath sath kam krna sikhata hai 
import { defineConfig } from 'vite'   // ye vite ki configuration likhne ka clean way hai 
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],

})

// Plugin kya karta hai?

// Vite ko batata hai ki project mein additional functionality/processors use karne hain.

// react() → Vite ko React ke saath work karne deta hai.
// tailwindcss() → Vite ko Tailwind CSS process karne deta hai.