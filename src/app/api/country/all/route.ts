import { getAllCountries } from "@/api/services/countryService";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
      const countries = await getAllCountries();
  
      if (!countries) {
        return NextResponse.json({ error: 'Country not found' }, { status: 404 });
      }
  
      return NextResponse.json(countries, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }
  