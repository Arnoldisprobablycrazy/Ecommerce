// src/app/api/search/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const supabase = await createClient();
    
    // Search across multiple tables (products, categories, brands)
    const [productsResult, categoriesResult] = await Promise.all([
      supabase
        .from('Products')
        .select('name, slug')
        .ilike('name', `%${query}%`)
        .limit(5),
      
      supabase
        .from('Categories')
        .select('name, slug')
        .ilike('name', `%${query}%`)
        .limit(5)
    ]);

    // Combine and format results
    const suggestions = [
      ...(productsResult.data?.map(item => ({
        type: 'product' as const,
        name: item.name,
        slug: item.slug
      })) || []),
      
      ...(categoriesResult.data?.map(item => ({
        type: 'category' as const,
        name: item.name,
        slug: item.slug
      })) || [])
    ];

    // Sort by relevance (you can implement more sophisticated ranking)
    suggestions.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ suggestions: suggestions.slice(0, 8) });
    
  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}