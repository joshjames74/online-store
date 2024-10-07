// import { getCurrencyById } from "../../api/services/currencyService";
// import { PrismaClient } from "@prisma/client";

import { getCurrencyById } from "../../api/services/currencyService";
import { prismaMock } from "../../../singleton"

// jest.mock('@prisma/client');
// const prisma = new PrismaClient();

// describe('getCurrencyById', () => {
//     it('should return a currency when found', async () => {
//         const mockCurrency = { id: 46, code: "GBP", gbp_exchange_rate: 1};
//         prisma.currency.findUnique = jest.fn().mockResolvedValue(mockCurrency);

//         const currency = await getCurrencyById(46);
//         expect(currency).toEqual(mockCurrency);
//         expect(prisma.currency.findUnique).toHaveBeenCalledWith({ where: {id: 46}})
//     });
// });

test('should get currrency', async () => {
    const currency = { id: 46, code: "GBP", symbol: "£", gbp_exchange_rate: 1}

    // prismaMock.currency.create.mockResolvedValue(currency);

    await expect(getCurrencyById(46)).resolves.toEqual(currency);

})