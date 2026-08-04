import { type NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        inlineCss: true,
        useTypeScriptCli: true,
    }
}

export default nextConfig
