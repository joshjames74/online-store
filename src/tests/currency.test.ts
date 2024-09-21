import { PrismaClient } from "@prisma/client";

// Mock the Prisma Client
const mockCreate = jest.fn();

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
            return {
                currency: {
                    create: mockCreate,
                },
            };
        }),
    };
});

// Function to add currency
const addCurrency = async (code: string, symbol: string, gbp_exchange_rate: number) => {
    const prisma = new PrismaClient();
    return await prisma.currency.create({
        data: {
            code,
            symbol,
            gbp_exchange_rate,
        },
    });
};

describe('Currency Service', () => {
    it('should create a currency', async () => {
        const mockCode = "GBP";
        const mockSymbol = "£";
        const mockGBPExchangeRate = 1.0;

        // Set up the mock to return a value when called
        mockCreate.mockResolvedValue({
            currency_id: 1,
            code: mockCode,
            symbol: mockSymbol,
            gbp_exchange_rate: mockGBPExchangeRate,
        });

        const result = await addCurrency(mockCode, mockSymbol, mockGBPExchangeRate);

        expect(result).toEqual({
            currency_id: 1,
            code: mockCode,
            symbol: mockSymbol,
            gbp_exchange_rate: mockGBPExchangeRate,
        });
    });
});
