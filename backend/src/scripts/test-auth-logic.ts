import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Role } from '../core/roles.js';
import { config } from '../config/config.js';
import { logger } from '../core/logger.js';

// Setup basic validation
const testAuthLogic = async () => {
  logger.info('--- Starting Authentication Cryptographic Logic Tests ---');

  // Test 1: Password Hashing
  const password = 'SecurePassword123';
  logger.info('Testing bcrypt password hashing...');
  const startHash = Date.now();
  const hash = await bcrypt.hash(password, 12);
  const hashTime = Date.now() - startHash;
  logger.info(`Password hashed in ${hashTime}ms. Hash: ${hash}`);

  const isValidMatch = await bcrypt.compare(password, hash);
  logger.info(`Password match validation check: ${isValidMatch ? 'PASSED' : 'FAILED'}`);
  if (!isValidMatch) throw new Error('Password verification failed');

  const isInvalidMatch = await bcrypt.compare('WrongPassword123', hash);
  logger.info(`Wrong password rejection check: ${!isInvalidMatch ? 'PASSED' : 'FAILED'}`);
  if (isInvalidMatch) throw new Error('Invalid password was accepted');

  // Test 2: JWT Generation & Signature Parsing
  logger.info('Testing JWT Token Generation...');
  const userId = crypto.randomUUID();
  const role = Role.ORG_ADMIN;
  
  const accessToken = jwt.sign({ userId, role }, config.JWT_SECRET, {
    expiresIn: '15m',
  });
  logger.info(`Access Token Generated: ${accessToken.substring(0, 30)}...`);

  const decoded = jwt.verify(accessToken, config.JWT_SECRET) as { userId: string; role: Role };
  logger.info(`Decoded Token Claims: userId=${decoded.userId}, role=${decoded.role}`);
  
  if (decoded.userId !== userId || decoded.role !== role) {
    throw new Error('JWT claims mismatch');
  }
  logger.info('JWT signature validation check: PASSED');

  // Test 3: Refresh Token SHA256 Hashing
  logger.info('Testing Refresh Token hashing logic...');
  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash1 = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
  const tokenHash2 = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
  
  logger.info(`Raw Refresh Token: ${rawRefreshToken.substring(0, 15)}...`);
  logger.info(`Hashed Refresh Token: ${tokenHash1}`);
  
  if (tokenHash1 !== tokenHash2) {
    throw new Error('Cryptographic hash is non-deterministic');
  }
  logger.info('Refresh token hashing check: PASSED');

  logger.info('--- All Cryptographic Auth Tests Completed Successfully ---');
};

testAuthLogic().catch((err) => {
  logger.error('Test execution failed:', err);
  process.exit(1);
});
