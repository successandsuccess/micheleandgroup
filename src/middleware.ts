import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { clientAuth } from './lib/firebaseclient';

export const middleware = async (req: NextRequest) => {
    
}

export const config = {
  matcher: ['/dashboard/:path*',],
};