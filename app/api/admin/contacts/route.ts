import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  getAllContacts, 
  upsertContact, 
  deleteContact, 
  updateContact, 
  syncHistoricalDataToContacts 
} from '@/lib/contacts';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_auth')?.value === 'authenticated';
}

export async function GET(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sourceFilter = searchParams.get('source');
    const tagFilter = searchParams.get('tag');
    const search = searchParams.get('q')?.toLowerCase().trim();

    let contacts = await getAllContacts();

    if (sourceFilter && sourceFilter !== 'all') {
      contacts = contacts.filter((c) => c.source === sourceFilter);
    }

    if (tagFilter && tagFilter !== 'all') {
      contacts = contacts.filter((c) => c.tags?.includes(tagFilter));
    }

    if (search) {
      contacts = contacts.filter((c) => {
        const nameMatch = c.name?.toLowerCase().includes(search);
        const emailMatch = c.email?.toLowerCase().includes(search);
        const phoneMatch = c.phone?.toLowerCase().includes(search);
        const cityMatch = c.city?.toLowerCase().includes(search);
        const instMatch = c.institution?.toLowerCase().includes(search);
        const tagMatch = c.tags?.some((t) => t.toLowerCase().includes(search));
        
        // Search inside dynamic customFields
        const customMatch = c.customFields 
          ? Object.values(c.customFields).some(val => String(val).toLowerCase().includes(search))
          : false;

        return nameMatch || emailMatch || phoneMatch || cityMatch || instMatch || tagMatch || customMatch;
      });
    }

    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    console.error('[Admin Contacts GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if this is a request to trigger historical data migration/sync
    if (body.action === 'sync_historical') {
      const stats = await syncHistoricalDataToContacts();
      return NextResponse.json({ 
        success: true, 
        message: `Sync completed! ${stats.synced} contacts synced/updated.`, 
        stats 
      });
    }

    // Otherwise, create/upsert manual contact
    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Name and Phone number are required.' }, { status: 400 });
    }

    const result = await upsertContact({
      name: body.name,
      phone: body.phone,
      email: body.email,
      city: body.city,
      institution: body.institution,
      source: body.source || 'manual',
      sourceEventTitle: body.sourceEventTitle,
      tags: body.tags || ['manual'],
      status: body.status || 'active',
      customFields: body.customFields || {},
      isSubscribedToEmail: body.isSubscribedToEmail !== false,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('[Admin Contacts POST] Error:', error);
    return NextResponse.json({ error: 'Failed to process contact request.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing contact ID.' }, { status: 400 });
    }

    const ok = await updateContact(id, updates);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to update contact.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Contact updated successfully.' });
  } catch (error) {
    console.error('[Admin Contacts PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update contact.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing contact ID.' }, { status: 400 });
    }

    const ok = await deleteContact(id);
    if (!ok) {
      return NextResponse.json({ error: 'Failed to delete contact.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Contact deleted successfully.' });
  } catch (error) {
    console.error('[Admin Contacts DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete contact.' }, { status: 500 });
  }
}
