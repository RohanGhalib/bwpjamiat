import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { certificateId, name, department, role, gender, type } = await request.json();

    if (!certificateId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Dynamic import for server-side libraries
    const { createCanvas } = await import('canvas');
    const jsPDF = (await import('jspdf')).jsPDF;

    // Render certificate as canvas (server-side alternative to html-to-image)
    const canvas = createCanvas(1123, 794);
    const ctx = canvas.getContext('2d');

    // Draw a solid background
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(0, 0, 1123, 794);

    // Add a simple text-based certificate
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('EMBER\'26 CERTIFICATE', 561, 150);

    ctx.font = '40px Arial';
    ctx.fillStyle = '#EB6E30';
    ctx.fillText('BAHAWALPUR', 561, 220);

    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(name.toUpperCase(), 561, 380);

    ctx.font = '30px Arial';
    ctx.fillStyle = '#CCCCCC';
    const pronouns = gender === 'boy' ? 'his' : gender === 'girl' ? 'her' : 'his/her';
    ctx.fillText(`for ${pronouns} exceptional services as ${role || 'Member'} in`, 561, 470);
    ctx.fillText(department.toUpperCase(), 561, 520);

    ctx.font = '20px Arial';
    ctx.fillStyle = '#999999';
    ctx.fillText('Certificate ID: ' + certificateId, 561, 700);

    // Convert canvas to image and add to PDF
    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    pdf.addImage(imageData, 'PNG', 0, 0, 297, 210);

    // Get PDF as buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Return with download headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Ember_Certificate_${name.replace(/\s+/g, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
  }
}
