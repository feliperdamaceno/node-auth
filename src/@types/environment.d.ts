import type { Secret } from 'jsonwebtoken'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: number
      MONGODB_URL: string
      JTW_SECRET: Secret
    }
  }
}

export {}
