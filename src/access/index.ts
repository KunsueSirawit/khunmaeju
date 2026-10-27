import type { Access, FieldAccess, Where } from 'payload'

export type Role = 'admin' | 'editor'

type MaybeUser = { role?: Role | null } | null | undefined

export const hasRole = (user: MaybeUser, ...roles: Role[]): boolean =>
  Boolean(user?.role && roles.includes(user.role))

export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

export const isAdminOrEditor: Access = ({ req: { user } }) => hasRole(user, 'admin', 'editor')

export const isAdminField: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')

export const anyone: Access = () => true

export const nobody: Access = () => false

/** Logged-in staff see drafts; the public only sees published documents. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (hasRole(user, 'admin', 'editor')) return true
  const where: Where = { _status: { equals: 'published' } }
  return where
}

/** Admins manage everyone; other users may only read and update themselves. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (hasRole(user, 'admin')) return true
  if (!user) return false
  const where: Where = { id: { equals: user.id } }
  return where
}
