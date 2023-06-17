import NextAuth from "next-auth/next"
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {  
        const res = await fetch("https://api.jasbiapp.site/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "Application/json"
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          })
        })

        const user = await res.json()
  
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          if (user.role !== 'USER') {
            return user
            
          }else{
            throw new Error('Unauthorized.')

          }
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          throw new Error('Incorrect username or password.')
  
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
    // ...add more providers here
  ],
  callbacks: {
    async jwt({token, user}: {token: any, user:any }) {
      return {...token, ...user}
    },
    async session({session, token}: {session: any, token:any }) {
      session.user = token as any
      return session
    },
    
  },
  pages:{
    signIn: '/auth/login'
  }
}
export default NextAuth(authOptions)

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. "Sign in with...")
//       name: "Credentials",
      
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "jsmith" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials, req) {  
//         const res = await fetch("https://api.jasbiapp.site/api/auth/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "Application/json"
//           },
//           body: JSON.stringify({
//             email: credentials?.username,
//             password: credentials?.password,
//           })
//         })

//         const user = await res.json()
  
//         if (user) {
//           // Any object returned will be saved in `user` property of the JWT
//           if (user.role !== 'USER') {
//             return user
            
//           }else{
//             throw new Error('Unauthorized.')

//           }
//         } else {
//           // If you return null then an error will be displayed advising the user to check their details.
//           throw new Error('Incorrect username or password.')
  
//           // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({token, user}) {
//       return {...token, ...user}
//     },
//     async session({session, token}) {
//       session.user = token as any
//       return session
//     },
    
//   },
//   // pages:{
//   //   signIn: '/auth/login'
//   // }
// })

// export {handler as GET, handler as POST}

