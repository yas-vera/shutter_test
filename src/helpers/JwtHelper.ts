import type { IUser } from "../interfaces/IUser"


export function parseJwtUser(token: string | null) {
  const jwt = parseJwt(token)
  return jwt
}

function parseJwt(token: string | null): IUser | null {
  if (token) {
    const [header, payload, signature] = token.split('.')
    const tokenData = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))

    let userData: any = Object.keys(tokenData).reduce((acc: any, key) => {
      const cleanedKey = key.replace('http://schemas.microsoft.com/ws/2008/06/identity/claims/', '')
      acc[cleanedKey] = tokenData[key]
      return acc
    }, {})

    userData = {
      ...userData,
      userdata: JSON.parse(userData.userdata)
    }

    return userData
  }
  return null
}
