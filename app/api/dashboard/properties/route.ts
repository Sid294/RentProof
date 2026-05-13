import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), '.data')
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json')

type StoredProperty = {
  id: string
  address: string
  city: string
  state: string
  zipCode?: string
  units: any[]
}

async function readProperties(): Promise<StoredProperty[]> {
  try {
    const raw = await fs.readFile(PROPERTIES_FILE, 'utf8')
    return JSON.parse(raw) as StoredProperty[]
  } catch {
    return []
  }
}

async function writeProperties(properties: StoredProperty[]) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2), 'utf8')
}

export async function GET(request: NextRequest) {
  // TODO: Verify user authentication
  // TODO: Fetch from database filtered by user ID

  const properties = await readProperties()

  return NextResponse.json(properties)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, city, state, zipCode } = body

    if (!address || !city || !state) {
      return NextResponse.json(
        { error: 'Address, city, and state are required' },
        { status: 400 }
      )
    }

    const properties = await readProperties()
    const newProperty: StoredProperty = {
      id: `prop_${Date.now()}`,
      address,
      city,
      state,
      zipCode,
      units: [],
    }

    properties.push(newProperty)
    await writeProperties(properties)

    return NextResponse.json(
      {
        success: true,
        property: newProperty,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
