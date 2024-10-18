/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VALID_PASSWORDS: process.env.VALID_PASSWORDS,
  },
}

export default nextConfig
