import { query } from "../db"

export type DeviceAlert = {
  id: string
  device_id: string
  title: string
  message: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "IGNORED"
  timestamp: string
  resolved_at?: string
  user_id: string
}

export const alertService = {
  // Get all alerts
  async getAllAlerts(limit = 100): Promise<DeviceAlert[]> {
    const result = await query("SELECT * FROM device_alerts ORDER BY timestamp DESC LIMIT $1", [limit])
    return result.rows
  },

  // Get alerts by device ID
  async getAlertsByDeviceId(deviceId: string, status?: string, limit = 100): Promise<DeviceAlert[]> {
    let sql = "SELECT * FROM device_alerts WHERE device_id = $1"
    const params = [deviceId]

    if (status) {
      sql += " AND status = $2"
      params.push(status)
    }

    sql += " ORDER BY timestamp DESC LIMIT $" + (params.length + 1)
    params.push(limit)

    const result = await query(sql, params)
    return result.rows
  },

  // Get alerts by user ID
  async getAlertsByUserId(userId: string, status?: string, limit = 100): Promise<DeviceAlert[]> {
    let sql = `
      SELECT a.* FROM device_alerts a
      JOIN devices d ON a.device_id = d.id
      WHERE d.user_id = $1
    `
    const params = [userId]

    if (status) {
      sql += " AND a.status = $2"
      params.push(status)
    }

    sql += " ORDER BY a.timestamp DESC LIMIT $" + (params.length + 1)
    params.push(limit)

    const result = await query(sql, params)
    return result.rows
  },

  // Get alert by ID
  async getAlertById(id: string): Promise<DeviceAlert | null> {
    const result = await query("SELECT * FROM device_alerts WHERE id = $1", [id])
    return result.rows[0] || null
  },

  // Create alert
  async createAlert(alert: Omit<DeviceAlert, "id" | "timestamp">): Promise<DeviceAlert> {
    const { device_id, title, message, severity, status, user_id } = alert
    const result = await query(
      "INSERT INTO device_alerts (device_id, title, message, severity, status, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [device_id, title, message, severity, status || "ACTIVE", user_id],
    )
    return result.rows[0]
  },

  // Update alert
  async updateAlert(id: string, updates: Partial<DeviceAlert>): Promise<DeviceAlert> {
    const fields = Object.keys(updates)
      .filter((key) => key !== "id" && key !== "timestamp")
      .map((key, index) => `${key} = $${index + 1}`)

    const values = Object.values(updates).filter((_, index) => fields[index] !== "id" && fields[index] !== "timestamp")

    if (fields.length === 0) {
      return this.getAlertById(id) as Promise<DeviceAlert>
    }

    const result = await query(
      `UPDATE device_alerts SET ${fields.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id],
    )

    return result.rows[0]
  },

  // Get alert statistics
  async getAlertStats(userId?: string): Promise<any> {
    // Get alert severity counts
    let severityQuery = `
      SELECT a.severity, COUNT(*) as count 
      FROM device_alerts a
    `
    let severityParams: any[] = []

    // If userId is provided, filter by user's devices
    if (userId) {
      severityQuery += `
        JOIN devices d ON a.device_id = d.id
        WHERE d.user_id = $1 AND a.status = 'ACTIVE'
      `
      severityParams = [userId]
    } else {
      severityQuery += " WHERE a.status = 'ACTIVE'"
    }

    severityQuery += " GROUP BY a.severity"

    const severityResult = await query(severityQuery, severityParams)
    const alertSeverityCounts = severityResult.rows

    // Get total active alerts
    let totalQuery = "SELECT COUNT(*) as total FROM device_alerts WHERE status = 'ACTIVE'"
    let totalParams: any[] = []

    // If userId is provided, filter by user's devices
    if (userId) {
      totalQuery = `
        SELECT COUNT(*) as total 
        FROM device_alerts a
        JOIN devices d ON a.device_id = d.id
        WHERE d.user_id = $1 AND a.status = 'ACTIVE'
      `
      totalParams = [userId]
    }

    const totalResult = await query(totalQuery, totalParams)
    const totalAlerts = Number.parseInt(totalResult.rows[0].total)

    return {
      totalAlerts,
      alertSeverityCounts,
    }
  },
}
