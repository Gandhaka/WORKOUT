import 'bootstrap/dist/css/bootstrap.min.css'
import "./globals.css"
import { AuthProvider } from './context/AuthContext.js'

import {Inter} from "next/font/google" 

const inter = Inter ({
  subsets : ['latin'],
  variable : '--font-inter',
  display : 'swap'

})

export const metaData = {
  title : 'Workout App',
  description : 'Manage Your Workout And Routines'
}

export default function RootLayout({ children }) {
  return (
    
    <html lang="en">
      <body className={inter.variable}>
         <AuthProvider>{children}
         </AuthProvider>
         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
      </body>
    </html>

  );
}

