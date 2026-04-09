import { SignJWT } from "jose"
import { verifyWpJwt, extractJwtFromCookie } from "./jwt"

const SECRET = "test_secret_key_minimum_32_characters_long_ok"

beforeAll(() => {
  process.env.JWT_SECRET_KEY = SECRET
})

async function signTestToken(overrides: Record<string, unknown> = {}) {
  const payload = {
    iss: "https://esimplu.com",
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    data: { user: { id: "42" } },
    ...overrides,
  }
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(SECRET))
}

describe("verifyWpJwt", () => {
  it("retourne le payload pour un token valide", async () => {
    const token = await signTestToken()
    const payload = await verifyWpJwt(token)
    expect(payload.data.user.id).toBe("42")
  })

  it("rejette un token signé avec une mauvaise clé", async () => {
    const badToken = await new SignJWT({ data: { user: { id: "1" } } })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode("wrong_secret_key_minimum_32_chars"))
    await expect(verifyWpJwt(badToken)).rejects.toThrow()
  })

  it("rejette un token expiré", async () => {
    const token = await signTestToken({ exp: Math.floor(Date.now() / 1000) - 1 })
    await expect(verifyWpJwt(token)).rejects.toThrow()
  })
})

describe("extractJwtFromCookie", () => {
  it("extrait le token depuis un header cookie", () => {
    const token = extractJwtFromCookie("wp_jwt=abc123; other=val")
    expect(token).toBe("abc123")
  })

  it("retourne null si wp_jwt absent", () => {
    expect(extractJwtFromCookie("session=xyz")).toBeNull()
    expect(extractJwtFromCookie(null)).toBeNull()
  })
})
