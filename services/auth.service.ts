import type { SupabaseClient, User } from '@supabase/supabase-js'

export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private supabase: SupabaseClient<any>) {}

  async signUp(email: string, password: string): Promise<User> {
    const { data, error } = await this.supabase.auth.signUp({ email, password })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Registration failed')
    return data.user
  }

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Login failed')
    return data.user
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  async getUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    return user
  }
}
