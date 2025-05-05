import type { NextApiRequest } from "next"
import { initSocket, type NextApiResponseWithSocket } from "@/lib/socket"

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  // Initialize socket if it doesn't exist
  const io = initSocket(req, res)

  // Send a response to acknowledge the socket connection
  res.status(200).json({ success: true })
}
