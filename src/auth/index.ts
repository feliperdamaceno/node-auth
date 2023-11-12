import jtw from 'jsonwebtoken'

export function createWebToken(email: string) {
  return jtw.sign({ email }, process.env.SECRET!, {
    algorithm: 'HS256',
    expiresIn: '3d'
  })
}
