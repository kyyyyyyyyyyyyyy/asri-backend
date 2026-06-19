import { query } from "../../shared/database/postgres.js";

export class AuthRepository {
  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await query(
      `UPDATE users
       SET refresh_token = $2, updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [userId, refreshToken]
    );
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await query(
      `UPDATE users
       SET refresh_token = NULL, updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [userId]
    );
  }
}
