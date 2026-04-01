'use client'

import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Keeps the sb-access-token cookie in sync with the Supabase session.
// The proxy reads this cookie to protect routes — without this, token
// refreshes and email-link logins would clear the cookie and log users out.
export default function AuthSync() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax`
        } else {
          document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return null
}
