import { Roboto, Kode_Mono } from 'next/font/google';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});
export const kodeMono = Kode_Mono({
  subsets: ['latin'], // Add 'latin-ext' if needed for extended characters
  variable: '--font-kodemono', // Custom CSS variable for flexibility
  display: 'swap', // Fallback during loading
});
