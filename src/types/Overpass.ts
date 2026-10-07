export interface OverpassTags {
  name?: string
  description?: string
  amenity?: string
  shop?: string
  tourism?: string
  wheelchair?: string
  'wheelchair:description'?: string
  'addr:street'?: string
  'addr:housenumber'?: string
  'addr:city'?: string
  'addr:state'?: string
}

export interface OverpassCenter {
  lat?: number
  lon?: number
}

export interface OverpassElement {
  id?: number
  lat?: number
  lon?: number
  center?: OverpassCenter
  tags?: OverpassTags
}

export interface OverpassResponse {
  elements?: OverpassElement[]
}