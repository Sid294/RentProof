import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, plan } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // TODO: Create user in Firebase or your auth service
    // TODO: Initialize user properties/subscription with chosen plan

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: 'new_user_id',
        email: email,
        name: name,
        plan: plan || 'growth',
        role: 'landlord',
      },
      redirectUrl: '/dashboard',
    })

    response.cookies.set({
      name: 'auth_token',
      value: 'token_placeholder',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
