import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

interface Project {
  id: string
  title: string
  location?: string
  latitude?: number
  longitude?: number
  category: string
  status: string
}

interface ProjectMapProps {
  projects: Project[]
  onProjectClick?: (projectId: string) => void
}

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)

const categoryColors: Record<string, string> = {
  INFRASTRUCTURE: '#ef4444',
  BEAUTIFICATION: '#22c55e',
  SOCIAL: '#3b82f6',
  COMMERCIAL: '#a855f7',
  ENVIRONMENTAL: '#10b981',
  CULTURAL: '#f59e0b',
  SPORTS: '#06b6d4',
  EDUCATION: '#8b5cf6',
  HEALTHCARE: '#ec4899',
  OTHER: '#6b7280'
}

const categoryLabels: Record<string, string> = {
  INFRASTRUCTURE: 'Инфраструктура',
  BEAUTIFICATION: 'Благоустройство',
  SOCIAL: 'Социальные',
  COMMERCIAL: 'Коммерция',
  ENVIRONMENTAL: 'Экология',
  CULTURAL: 'Культура',
  SPORTS: 'Спорт',
  EDUCATION: 'Образование',
  HEALTHCARE: 'Здравоохранение',
  OTHER: 'Другое'
}

export default function ProjectMap({ projects, onProjectClick }: ProjectMapProps) {
  const [mounted, setMounted] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    import('leaflet').then(leaflet => {
      setL(leaflet.default)
    })
  }, [])

  if (!mounted || !L) {
    return (
      <div style={{
        height: '400px',
        backgroundColor: '#f1f5f9',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b'
      }}>
        Загрузка карты...
      </div>
    )
  }

  const petropavlovskCenter: [number, number] = [54.8667, 69.1500]

  const projectsWithCoords = projects.filter(p => p.latitude && p.longitude)

  const createIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }

  return (
    <div style={{ height: '400px', borderRadius: '1rem', overflow: 'hidden' }}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <MapContainer
        center={petropavlovskCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projectsWithCoords.map(project => (
          <Marker
            key={project.id}
            position={[project.latitude!, project.longitude!]}
            icon={createIcon(categoryColors[project.category] || '#6b7280')}
          >
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  {project.title}
                </h3>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: categoryColors[project.category],
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  {categoryLabels[project.category]}
                </p>
                {project.location && (
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    {project.location}
                  </p>
                )}
                <button
                  onClick={() => onProjectClick?.(project.id)}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Подробнее
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
