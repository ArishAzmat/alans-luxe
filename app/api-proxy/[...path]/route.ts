import { NextRequest, NextResponse } from 'next/server'

function getBackendUrl(): string {
  const url =
    process.env.BACKEND_API_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000/api'
  return url.replace(/\/$/, '')
}

async function forwardRequest(
  request: NextRequest,
  paramsPromise: Promise<{ path: string[] }> | { path: string[] }
) {
  const params = await paramsPromise
  const path = params?.path ? params.path.join('/') : ''
  const search = request.nextUrl.search || ''
  const backendBase = getBackendUrl()
  const targetUrl = `${backendBase}/${path}${search}`

  const headers: Record<string, string> = {
    'Content-Type': request.headers.get('Content-Type') || 'application/json',
  }

  const auth = request.headers.get('authorization')
  if (auth) headers['authorization'] = auth

  const options: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const body = await request.text()
      if (body) options.body = body
    } catch {
      // ignore empty body
    }
  }

  try {
    const res = await fetch(targetUrl, options)
    const contentType = res.headers.get('Content-Type') || 'application/json'
    const data = await res.text()

    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': contentType,
      },
    })
  } catch (err: any) {
    // If running in local docker container and localhost:4000 fails, attempt host.docker.internal
    if (targetUrl.includes('localhost:4000')) {
      const fallbackUrl = targetUrl.replace('localhost:4000', 'host.docker.internal:4000')
      try {
        const res = await fetch(fallbackUrl, options)
        const contentType = res.headers.get('Content-Type') || 'application/json'
        const data = await res.text()
        return new NextResponse(data, {
          status: res.status,
          headers: {
            'Content-Type': contentType,
          },
        })
      } catch (fallbackErr: any) {
        // continue to error response
      }
    }

    return NextResponse.json(
      {
        message: `API Proxy failed to connect to backend at ${backendBase}: ${err?.message}`,
        targetUrl,
      },
      { status: 502 }
    )
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forwardRequest(req, ctx.params)
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forwardRequest(req, ctx.params)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forwardRequest(req, ctx.params)
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forwardRequest(req, ctx.params)
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forwardRequest(req, ctx.params)
}
