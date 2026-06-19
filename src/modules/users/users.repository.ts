import { query } from "../../shared/database/postgres.js";
import type { CreateUserDto, UpdateUserDto } from "./users.dto.js";
import type { User } from "./users.model.js";

type UserRow = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  google_id: string | null;
  role: User["role"];
  refresh_token: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    googleId: row.google_id,
    role: row.role,
    refreshToken: row.refresh_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at
  };
}

export class UsersRepository {
  async findById(id: string): Promise<User | null> {
    const result = await query<UserRow>(
      `SELECT id, email, name, avatar_url, google_id, role, refresh_token, created_at, updated_at, deleted_at
       FROM users
       WHERE id = $1 AND deleted_at IS NULL
       LIMIT 1`,
      [id]
    );

    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query<UserRow>(
      `SELECT id, email, name, avatar_url, google_id, role, refresh_token, created_at, updated_at, deleted_at
       FROM users
       WHERE email = $1 AND deleted_at IS NULL
       LIMIT 1`,
      [email]
    );

    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async create(payload: CreateUserDto): Promise<User> {
    const result = await query<UserRow>(
      `INSERT INTO users (email, name, avatar_url, google_id, role)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'buyer')::user_role)
       RETURNING id, email, name, avatar_url, google_id, role, refresh_token, created_at, updated_at, deleted_at`,
      [payload.email, payload.name, payload.avatarUrl ?? null, payload.googleId ?? null, payload.role ?? null]
    );

    return mapUser(result.rows[0]);
  }

  async update(id: string, payload: UpdateUserDto): Promise<User | null> {
    const result = await query<UserRow>(
      `UPDATE users
       SET
         name = COALESCE($2, name),
         avatar_url = COALESCE($3, avatar_url),
         role = COALESCE($4, role)::user_role,
         updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, email, name, avatar_url, google_id, role, refresh_token, created_at, updated_at, deleted_at`,
      [id, payload.name ?? null, payload.avatarUrl ?? null, payload.role ?? null]
    );

    return result.rows[0] ? mapUser(result.rows[0]) : null;
  }

  async delete(id: string): Promise<void> {
    await query(
      `UPDATE users
       SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
  }
}
