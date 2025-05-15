import { NextResponse } from "next/server"
import { z } from "zod"
import { deviceService } from "@/lib/services/device-service"
import { getUserFromRequest } from "@/lib/auth-utils"

// Schema for device creation
const createDeviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["ONLINE", "OFFLINE", "MAINTENANCE", "DISABLED"]),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  categoryId: z.string().uuid(),
})

// Schema for device update
const updateDeviceSchema = createDeviceSchema.partial()

// GET /api/devices - Get all devices
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const categoryId = searchParams.get("categoryId")
//     const status = searchParams.get("status")
//     const search = searchParams.get("search")

//     const session = await getServerSession(authOptions)

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Build filter conditions
//     const where: any = {
//       userId: session.user.id,
//     }

//     if (categoryId) {
//       where.categoryId = categoryId
//     }

//     if (status) {
//       where.status = status
//     }

//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: "insensitive" } },
//         { serialNumber: { contains: search, mode: "insensitive" } },
//         { description: { contains: search, mode: "insensitive" } },
//       ]
//     }

//     const devices = await prisma.device.findMany({
//       where,
//       include: {
//         category: true,
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     })

//     return NextResponse.json(devices)
//   } catch (error) {
//     console.error("Error fetching devices:", error)
//     return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 })
//   }
// }

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const devices = await deviceService.getDevicesByUserId(user.id)
    return NextResponse.json({ devices })
  } catch (error) {
    console.error("Error fetching devices:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/devices - Create a new device
// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()

//     // Validate request body
//     const validationResult = createDeviceSchema.safeParse(body)

//     if (!validationResult.success) {
//       return NextResponse.json({ error: "Validation error", details: validationResult.error.format() }, { status: 400 })
//     }

//     const data = validationResult.data

//     // Get user ID from session (implement your auth logic)
//     const userId = session.user.id

//     // Create the device
//     const device = await prisma.device.create({
//       data: {
//         ...data,
//         userId,
//       },
//       include: {
//         category: true,
//       },
//     })

//     // Log activity
//     await prisma.activity.create({
//       data: {
//         userId: session.user.id,
//         action: "device_add",
//         details: `Añadido nuevo dispositivo: ${device.name}`,
//       },
//     })

//     return NextResponse.json(device, { status: 201 })
//   } catch (error) {
//     console.error("Error creating device:", error)
//     return NextResponse.json({ error: "Failed to create device" }, { status: 500 })
//   }
// }

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const device = await deviceService.createDevice({
      ...body,
      user_id: user.id,
    })

    return NextResponse.json({ device }, { status: 201 })
  } catch (error) {
    console.error("Error creating device:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Additional routes for specific device operations
// PUT /api/devices/:id - Update a device
// DELETE /api/devices/:id - Delete a device
