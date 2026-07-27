import { type NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        inlineCss: true,
        useTypeScriptCli: true,
        viewTransition: true,
    }
}

export default nextConfig
