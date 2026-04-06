import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = await fetch('https://api.huemint.com/color', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        mode: "transformer", 
        num_colors: 6, 
        temperature: "1.2",
        num_results: 1,
        adjacency: [
          "0","65","45","35","0","0",
          "65","0","35","65","0","0",
          "45","35","0","0","0","0",
          "35","65","0","0","0","0",
          "0","0","0","0","0","0",
          "0","0","0","0","0","0"
        ],
        palette: ["-","-","-","-","-","-"]
      })
    });
    
    if (!response.ok) {
       return NextResponse.json({ error: 'Failed to fetch from Huemint' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: 'ML API Error', details: err.message }, { status: 500 });
  }
}
