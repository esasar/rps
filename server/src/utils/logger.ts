const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[031m',
  cyan: '\x1b[036m'
}

const log = (level: string, color: string, message: string) => {
  const timestamp = new Date().toISOString()
  console.log(`${colors.cyan}[${timestamp}] ${color}${level}:${colors.reset} ${message}`)
}

const info = (message: string) => {
  log('INFO', colors.green, message)
}

const error = (message: string) => {
  log('ERROR', colors.red, message)
}

const logger = {
  info,
  error,
}

export default logger
