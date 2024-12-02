export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  aws: AwsConfig;
  jwt: JwtConfig;
  mailer: MailerConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};
export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
};
export type RedisConfig = {
  host: string;
  port: number;
  password: string;
};
export type AwsConfig = {
  accessKey: string;
  secretKey: string;
  bucketName: string;
  region: string;
  ACL: string;
  endpoint: string;
};
export type JwtConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
};
export type MailerConfig = {
  smtp_host: string;
  smtp_port: number;
  smtp_email: string;
  smtp_password: string;
  from_email: string;
};
