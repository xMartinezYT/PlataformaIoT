"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category } from "@/lib/services/category-service"
import type { Device } from "@/lib/services/device-service"
import { toast } from "@/components/ui/use-toast"

const deviceSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  serial_number: z.string().min(2, {
    message: "Serial number must be at least 2 characters.",
  }),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["ONLINE", "OFFLINE", "ERROR", "MAINTENANCE"]),
  location: z.string().optional(),
  latitude: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : null)),
  longitude: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseFloat(val) : null)),
  firmware_version: z.string().optional(),
  category_id: z.string().optional(),
})

type DeviceFormValues = z.infer<typeof deviceSchema>

interface DeviceFormProps {
  categories: Category[]
  device?: Device
  userId: string
}

export function DeviceForm({ categories, device, userId }: DeviceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: device
      ? {
          name: device.name,
          serial_number: device.serial_number,
          model: device.model || "",
          manufacturer: device.manufacturer || "",
          description: device.description || "",
          status: device.status as any,
          location: device.location || "",
          latitude: device.latitude ? String(device.latitude) : "",
          longitude: device.longitude ? String(device.longitude) : "",
          firmware_version: device.firmware_version || "",
          category_id: device.category_id || undefined,
        }
      : {
          name: "",
          serial_number: "",
          model: "",
          manufacturer: "",
          description: "",
          status: "OFFLINE",
          location: "",
          latitude: "",
          longitude: "",
          firmware_version: "",
          category_id: undefined,
        },
  })

  async function onSubmit(values: DeviceFormValues) {
    setIsSubmitting(true)

    try {
      const formData = {
        ...values,
        user_id: userId,
      }

      const response = await fetch(device ? `/api/devices/${device.id}` : "/api/devices", {
        method: device ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save device")
      }

      toast({
        title: device ? "Device updated" : "Device created",
        description: device
          ? `${values.name} has been updated successfully.`
          : `${values.name} has been created successfully.`,
      })

      router.push("/devices")
      router.refresh()
    } catch (error) {
      console.error("Error saving device:", error)
      toast({
        title: "Error",
        description: "Failed to save device. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Device name" {...field} />
                </FormControl>
                <FormDescription>The name of your device.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serial_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="Serial number" {...field} />
                </FormControl>
                <FormDescription>The unique serial number of your device.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Device model" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Device manufacturer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                    <SelectItem value="ERROR">Error</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Device location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firmware_version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firmware Version</FormLabel>
                <FormControl>
                  <Input placeholder="Firmware version" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="Latitude" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="Longitude" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Device description" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/devices")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : device ? "Update Device" : "Create Device"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
