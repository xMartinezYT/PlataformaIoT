"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

type CommandType = "power" | "restart" | "update" | "configure" | "calibrate"

interface CommandParameters {
  [key: string]: any
}

interface UseDeviceControlProps {
  deviceId: string
}

interface CommandResult {
  success: boolean
  deviceId: string
  command: CommandType
  result: any
  error?: string
}

export function useDeviceControl({ deviceId }: UseDeviceControlProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastResult, setLastResult] = useState<CommandResult | null>(null)
  const { toast } = useToast()

  const sendCommand = async (command: CommandType, parameters?: CommandParameters): Promise<CommandResult> => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/devices/${deviceId}/control`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command,
          parameters,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send command")
      }

      const result = {
        success: true,
        deviceId,
        command,
        result: data.result,
      }

      setLastResult(result)

      toast({
        title: "Command sent successfully",
        description: `The ${command} command was sent to the device.`,
        variant: "default",
      })

      return result
    } catch (error) {
      const errorResult = {
        success: false,
        deviceId,
        command,
        result: null,
        error: error instanceof Error ? error.message : "Unknown error",
      }

      setLastResult(errorResult)

      toast({
        title: "Command failed",
        description: errorResult.error,
        variant: "destructive",
      })

      return errorResult
    } finally {
      setIsLoading(false)
    }
  }

  const powerToggle = () => sendCommand("power")
  const restart = () => sendCommand("restart")
  const update = (version?: string) => sendCommand("update", version ? { version } : undefined)
  const configure = (settings: Record<string, any>) => sendCommand("configure", settings)
  const calibrate = (sensor?: string) => sendCommand("calibrate", sensor ? { sensor } : undefined)

  return {
    isLoading,
    lastResult,
    sendCommand,
    powerToggle,
    restart,
    update,
    configure,
    calibrate,
  }
}
