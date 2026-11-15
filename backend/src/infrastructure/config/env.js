import 'dotenv/config';

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Mungon variabla "${name}". Kopjo .env.example si .env dhe plotësoje.`);
  }
  return value;
}

function port(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 65535) {
    throw new Error(`PORT i pavlefshëm: ${value}`);
  }
  return number;
}

function secret(value) {
  if (value.length < 32) {
    throw new Error('JWT_SECRET duhet të ketë të paktën 32 karaktere.');
  }
  return value;
}

const list = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: port(process.env.PORT ?? '4000'),
  corsOrigins: list(process.env.CORS_ORIGIN ?? 'http://localhost:5173'),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: secret(required('JWT_SECRET')),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
});
