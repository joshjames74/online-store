export function getSkipTakeFromPage(
  perPage: number | undefined,
  pageNumber: number | undefined,
): { skip: number; take: number } {
  if (perPage == undefined && pageNumber == undefined) {
    // don't do any pagination
    return { skip: NaN, take: NaN };
  }

  // if per page not provided, do no pagination
  if (perPage == undefined || isNaN(parseInt(perPage.toString()))) {
    return { skip: NaN, take: NaN };
  }

  // if pageNumber not provided, assume page 1
  if (pageNumber == undefined || isNaN(parseInt(pageNumber.toString()))) {
    pageNumber = 1;
  }

  if (pageNumber < 0 || perPage < 0) {
    // return 0 results
    return { skip: 0, take: 0 };
  }

  // at this point: per page exists and is gte 0; pageNumber exists and is gte 0
  const take = Math.max(perPage, 0);
  const skip = Math.max((pageNumber - 1) * perPage, 0);

  return { take: take, skip: skip };
}
