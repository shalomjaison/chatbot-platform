import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./src/generated/prisma/**/*'],
    '/dashboard/**': ['./src/generated/prisma/**/*'],
    '/**': ['./src/generated/prisma/query-engine-rhel-openssl-3.0.x'],
  },
};

export default nextConfig;
