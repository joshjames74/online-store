import { getHelper } from "@/api/helpers/request";
import { parseOrderSearchParams } from "@/api/helpers/utils";
import { getOrderViewsBySearch } from "@/api/services/orderService";
import { OrderFilter } from "@/api/transformers/orderSearchTransformer";
import { NextRequest, NextResponse } from "next/server";


// TO DO: move to user and include user id

export async function GET(req: NextRequest): Promise<NextResponse> {

  // to do: new function to do the parsing

  const { searchParams } = new URL(req.url);
  const params = parseOrderSearchParams(searchParams);
  
  // const min_date = new Date(searchParams.get('min_date') || '');
  // const max_date = ((searchParams.get('max_date') || ''));
  // const take = parseInt(searchParams.get('take') || '');
  // const skip = parseInt(searchParams.get('skip') || '');


  // // parse enum
  // const order_filter_raw = parseInt(searchParams.get('order_filter') || '');
  // var order_filter: OrderFilter;

  // if (order_filter_raw && Object.values(OrderFilter).includes(order_filter_raw as OrderFilter)) {
  //   order_filter = order_filter_raw as OrderFilter;
  // }

  // const params = { min_date, max_date, order_filter, skip, take };
  console.log(params);

  return getHelper(getOrderViewsBySearch, params);
};
