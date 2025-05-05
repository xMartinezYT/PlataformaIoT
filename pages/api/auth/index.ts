// Este archivo es solo para asegurar que la carpeta auth existe
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "Auth API is working" })
}
