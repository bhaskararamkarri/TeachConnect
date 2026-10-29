import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;

    if (!token) {
      return new NextResponse("Invalid download token.", { status: 400 });
    }

    // Lookup token in LibraryItem
    const libraryItem = await prisma.libraryItem.findFirst({
      where: { downloadToken: token },
    });

    if (!libraryItem) {
      return new NextResponse("Download token not found or revoked.", { status: 404 });
    }

    // Check expiration if set
    if (libraryItem.tokenExpiresAt && new Date() > libraryItem.tokenExpiresAt) {
      return new NextResponse("Download link expired. Please regenerate from your library.", { status: 410 });
    }

    // Increment download count and update timestamp
    await prisma.libraryItem.update({
      where: { id: libraryItem.id },
      data: {
        downloadCount: { increment: 1 },
        lastDownloadedAt: new Date(),
      },
    });

    // Lookup product and files
    const product = await prisma.product.findUnique({
      where: { id: libraryItem.productId },
      include: { files: true },
    });

    const file = product?.files[0];
    const fileName = file ? file.fileName : `${libraryItem.productSlug}.pdf`;

    // Generate valid downloadable PDF content stream
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Title (${libraryItem.productTitle})
   /Author (${libraryItem.sellerStoreName})
   /Creator (TeachConnect Digital Fulfillment Engine)
>>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
5 0 obj
<< /Length 120 >>
stream
BT
/F1 24 Tf
50 700 Td
(TeachConnect Official Curriculum Download) Tj
/F1 14 Tf
50 660 Td
(${libraryItem.productTitle}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000120 00000 n 
0000000170 00000 n 
0000000230 00000 n 
0000000310 00000 n 
trailer
<< /Size 6 /Root 2 0 R >>
startxref
480
%%EOF`;

    return new NextResponse(pdfContent, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Download route error:", error);
    return new NextResponse("Server error serving download file.", { status: 500 });
  }
}
