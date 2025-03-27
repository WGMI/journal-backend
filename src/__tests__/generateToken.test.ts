process.env.JWT_SECRET = 'testsecret'; // Add this at the top

import { generateToken } from '../utils/generateToken';
import jwt from 'jsonwebtoken';

describe('generateToken', () => {
  const userId = 123;

  it('should return a valid JWT token with userId inside', () => {
    const token = generateToken(userId);
    const decoded = jwt.verify(token, 'testsecret') as { userId: number };
    expect(decoded.userId).toBe(userId);
  });
});
