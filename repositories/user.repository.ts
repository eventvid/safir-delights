import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserRole, UserRoleType } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseDB = SupabaseClient<any>

export class UserRepository {
  constructor(private supabase: SupabaseDB) {}

  async findRole(userId: string): Promise<UserRole | null> {
    const { data, error } = await this.supabase
      .from('roles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) return null
    return data as UserRole
  }

  async isAdmin(userId: string): Promise<boolean> {
    const role = await this.findRole(userId)
    return role?.role === 'admin'
  }

  async setRole(userId: string, role: UserRoleType): Promise<UserRole> {
    const { data, error } = await this.supabase
      .from('roles')
      .upsert({ user_id: userId, role })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as UserRole
  }
}
