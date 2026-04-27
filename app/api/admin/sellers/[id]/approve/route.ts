import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/roles"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/api/respond"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const seller = await prisma.sellerProfile.update({
      where: { id },
      data: { approved: true },
    })
    return NextResponse.json({ seller })
  } catch (err) {
    return handleApiError(err)
  }
}
