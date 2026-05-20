import { NextResponse } from 'next/server';
import jsPDF from 'jspdf';

export async function POST(request: Request) {
  try {
    const { certificateId, name, department, type } = await request.json();

    if (!certificateId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a basic PDF without canvas
    const pdf = new jsPDF('landscape', 'mm', 'a4');

    // Set background color
    pdf.setFillColor(10, 25, 47);
    pdf.rect(0, 0, 297, 210, 'F');

    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(48);
    pdf.text('EMBER\'26 CERTIFICATE', 148.5, 50, { align: 'center' });

    // Subtitle
    pdf.setTextColor(235, 110, 48);
    pdf.setFontSize(32);
    pdf.text('BAHAWALPUR', 148.5, 75, { align: 'center' });

    // Name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(44);
    pdf.text(name.toUpperCase(), 148.5, 110, { align: 'center' });

    // Description
    pdf.setFontSize(16);
    pdf.setTextColor(200, 200, 200);
    pdf.text('For exceptional services in', 148.5, 135, { align: 'center' });
    pdf.text(department.toUpperCase(), 148.5, 145, { align: 'center' });
    pdf.text('at Ember\'26, South Punjab\'s largest hackathon for teenagers', 148.5, 155, { align: 'center' });

    // Certificate ID
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Certificate ID: ${certificateId}`, 148.5, 185, { align: 'center' });

    // Get PDF as buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Return with download headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Ember_Certificate_${name.replace(/\s+/g, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate', details: error.message }, { status: 500 });
  }
}
