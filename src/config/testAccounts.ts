export const TEST_ACCOUNTS = {
  development: {
    admin: {
      email: 'admin@test.rockethooks.com',
      password: 'TestPassword123!',
      role: 'admin',
    },
    user: {
      email: 'user@test.rockethooks.com',
      password: 'TestPassword123!',
      role: 'user',
    },
  },
} as const

export function getTestAccount(role: keyof typeof TEST_ACCOUNTS.development) {
  const env = import.meta.env.MODE
  if (env !== 'development') {
    throw new Error('Test accounts only available in development')
  }
  return TEST_ACCOUNTS.development[role]
}
