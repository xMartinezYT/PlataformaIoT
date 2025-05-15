import { query } from "../db"

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  status: "READ" | "UNREAD"
  link?: string
  read_at?: string
  created_at: string
}

export const notificationService = {
  // Get notifications by user ID
  async getNotificationsByUserId(userId: string, status?: string, limit = 20): Promise<Notification[]> {
    let sql = "SELECT * FROM notifications WHERE user_id = $1"
    const params = [userId]

    if (status) {
      sql += " AND status = $2"
      params.push(status)
    }

    sql += " ORDER BY created_at DESC LIMIT $" + (params.length + 1)
    params.push(limit)

    const result = await query(sql, params)
    return result.rows
  },

  // Get notification by ID
  async getNotificationById(id: string): Promise<Notification | null> {
    const result = await query("SELECT * FROM notifications WHERE id = $1", [id])
    return result.rows[0] || null
  },

  // Create notification
  async createNotification(notification: Omit<Notification, "id" | "created_at">): Promise<Notification> {
    const { user_id, title, message, type, status, link } = notification
    const result = await query(
      "INSERT INTO notifications (user_id, title, message, type, status, link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, title, message, type, status || "UNREAD", link],
    )
    return result.rows[0]
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<Notification> {
    const result = await query("UPDATE notifications SET status = 'READ', read_at = NOW() WHERE id = $1 RETURNING *", [
      id,
    ])
    return result.rows[0]
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await query(
      "UPDATE notifications SET status = 'READ', read_at = NOW() WHERE user_id = $1 AND status = 'UNREAD'",
      [userId],
    )
    return result.rowCount > 0
  },

  // Delete notification
  async deleteNotification(id: string): Promise<boolean> {
    const result = await query("DELETE FROM notifications WHERE id = $1", [id])
    return result.rowCount > 0
  },

  // Get unread notification count for a user
  async getUnreadCount(userId: string): Promise<number> {
    const result = await query("SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND status = 'UNREAD'", [
      userId,
    ])
    return Number.parseInt(result.rows[0].count)
  },
}
