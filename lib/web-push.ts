import webPush from "web-push"

// VAPID keys should be generated only once and stored securely
// For production, these should be environment variables
const vapidKeys = {
  // Claves generadas con npx web-push generate-vapid-keys --json
  publicKey:
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    "BNbxGYNMhEtUZdcJSn-mI7bhwbTLcfplVQbPWmgJyWaiRLELFR5aHPRr_4q1Ehy8Jm4a-nHPWQHoT-9pdP0Ww1A",
  privateKey: process.env.VAPID_PRIVATE_KEY || "3KzvKasA2tfJ-IZ4S0WSWGKzYsAJdgqK0RqIMeJGNn8",
}

// Set up VAPID details for web push
webPush.setVapidDetails(
  "mailto:admin@iotplatform.com", // This should be a real contact email in production
  vapidKeys.publicKey,
  vapidKeys.privateKey,
)

export { webPush }
export const publicVapidKey = vapidKeys.publicKey
