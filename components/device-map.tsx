"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layers, MapPin, Navigation, ZoomIn, ZoomOut } from "lucide-react"

interface DeviceMapProps {
  device: {
    id: string
    name: string
    location: string
    coordinates: {
      lat: number
      lng: number
    }
    status: string
  }
}

export default function DeviceMap({ device }: DeviceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // En un entorno real, aquí se inicializaría un mapa con las coordenadas del dispositivo
    // Por ejemplo, usando Mapbox, Google Maps, Leaflet, etc.

    if (mapRef.current) {
      // Simulación de un mapa
      const mapContainer = mapRef.current
      mapContainer.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; background-color: #e5e7eb; overflow: hidden; border-radius: 0.375rem;">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
              <div style="width: 2rem; height: 2rem; border-radius: 9999px; background-color: ${
                device.status === "online" ? "#22c55e" : device.status === "warning" ? "#f59e0b" : "#ef4444"
              }; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div style="font-weight: 500; font-size: 0.875rem;">${device.name}</div>
              <div style="font-size: 0.75rem; color: #6b7280;">${device.location}</div>
              <div style="font-size: 0.75rem; color: #6b7280;">Lat: ${device.coordinates.lat.toFixed(4)}, Lng: ${device.coordinates.lng.toFixed(4)}</div>
            </div>
          </div>
          <div style="position: absolute; bottom: 1rem; right: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="width: 2rem; height: 2rem; border-radius: 0.25rem; background-color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <div style="width: 2rem; height: 2rem; border-radius: 0.25rem; background-color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>
      `
    }
  }, [device])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ubicación del Dispositivo</CardTitle>
          <CardDescription>Visualización geográfica del dispositivo</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Navigation className="mr-2 h-4 w-4" />
            Direcciones
          </Button>
          <Button variant="outline" size="icon">
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div ref={mapRef} className="h-[400px] w-full rounded-md bg-muted"></div>
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 shadow-md">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">Dirección</div>
            <div className="text-muted-foreground">Av. Industrial 1234, Sector 3, Planta Principal</div>
          </div>
          <div>
            <div className="font-medium">Coordenadas</div>
            <div className="text-muted-foreground">
              Lat: {device.coordinates.lat.toFixed(4)}, Lng: {device.coordinates.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
