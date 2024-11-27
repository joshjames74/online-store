import { generateMockBasketFromItems, generateMockBasketItemWithProduct, generateMockCountry, generateMockCurrency, generateMockProduct, generateMockUser } from "@/tests/generate";
import { Basket } from "@/api/services/basketItemService";
import { faker } from "@faker-js/faker";
import { fireEvent, screen, act, waitFor } from '@testing-library/react';
import BasketPage from "@/components/basket/basket-page";
import { useMediaQuery } from "@chakra-ui/react";
import { UserWithCurrencyAndCountry } from "@/api/services/userService";
import { useSession } from "next-auth/react";
import * as BasketRequest from "../../../api/request/basketRequest";
import { renderWithProvider } from "../../utils/provider";
import { IUser } from "@/contexts/user-context";

jest.mock('next-auth/react');
jest.mock("./../../../api/request/basketRequest", () => ({
    getBasketByUserId: jest.fn(),
}));
jest.mock("@chakra-ui/react", () => ({
    ...jest.requireActual("@chakra-ui/react"), 
    useMediaQuery: jest.fn(), 
  }));
  


describe('mock displaying a user basket', () => {
    
    let basket: Basket;
    let activeUser: UserWithCurrencyAndCountry;
    let session: any;
    let userContext: IUser;
    
    beforeEach(async () => {
        const count = 2;
        
        // create country and currency
        const mockCountry = generateMockCountry();
        const mockCurrency = generateMockCurrency();
        
        // create users
        const mockUsers = Array.from({ length: count}, generateMockUser);
        const userIds = mockUsers.map(user => user.id);
        activeUser = Object.assign(mockUsers[0], { id: 1, currency: mockCurrency, country: mockCountry })
        
        // session data
        session = {
            data: { user: { name: activeUser.name, email: activeUser.email }, expires: faker.date.future(), }, 
            status: 'authenticated'
        }
        
        // create products
        const mockProducts = Array.from({ length: count }, () => generateMockProduct(userIds));
        const productIds = mockProducts.map(product => product.id);
        
        // create basket items
        const mockItems = Array.from({ length: count }, () => generateMockBasketItemWithProduct(productIds, [activeUser.id]));
        basket = generateMockBasketFromItems(mockItems);

        // create user context
        userContext = { 
            user: activeUser, 
            isAuthenticated: true, 
            isLoading: false, 
            reload: async () => {},
        };
        
        // mock calls
        (useMediaQuery as jest.Mock).mockReturnValue([true]);
        (BasketRequest.getBasketByUserId as jest.Mock).mockReset();
        (useSession as jest.Mock).mockReturnValue(session);
    });
    
    
    it('no user: should display not found', async () => {
        (BasketRequest.getBasketByUserId as jest.Mock).mockResolvedValue({});
        userContext.user = {} as UserWithCurrencyAndCountry;
        renderWithProvider(<BasketPage />, userContext)

        const element = await screen.findByText((content, element) => content.includes("User not found"));
        expect(element).toBeInTheDocument();
    });
    

    it('empty basket: should display empty basket page', async () => {
        (BasketRequest.getBasketByUserId as jest.Mock).mockResolvedValue({});
        renderWithProvider(<BasketPage />, userContext)

        const element = await screen.findByText((content, element) => content.includes("Basket is empty"));
        expect(element).toBeInTheDocument();
    });
    
    it('basket exists: should display correct page', async () => {
        (BasketRequest.getBasketByUserId as jest.Mock).mockResolvedValue(basket);
        renderWithProvider(<BasketPage />, userContext)

        
        const element = await screen.findByText((content, element) => content.includes("Shopping Basket"));
        expect(element).toBeInTheDocument();
    });
    
    it('basket exists: should contain the correct products', async () => {
        (BasketRequest.getBasketByUserId as jest.Mock).mockResolvedValue(basket);
        renderWithProvider(<BasketPage />, userContext)
        
        const titles = basket.items.map(item => item.product.title);
        
        for (const product of titles) {
            const element = await screen.findByText((content, element) => content.includes(product));
            expect(element).toBeInTheDocument();
        }
    });
    
    it('contains checkout button', async () => {
        (BasketRequest.getBasketByUserId as jest.Mock).mockResolvedValue(basket);
        renderWithProvider(<BasketPage />, userContext)

        // doesnt appear on first load
        await waitFor(() => screen.getByText("Checkout"));
        const button = screen.getByText("Checkout");
        
        // need to wrap here
        await act(async () => {
            fireEvent.click(button);
          });

        expect(button).toBeInTheDocument();
        
        // to do:
        // what we expect the button to do
    });

    it('basket exists, no items: should display empty basket', async () => {
        (BasketRequest.getBasketByUserId as jest.Mock).mockResolvedValue({ items: [], metadata: { count: 0 }});
        renderWithProvider(<BasketPage />, userContext)

        const element = await screen.findByText((content, element) => content.includes("Basket is empty"));
        expect(element).toBeInTheDocument();
    });



})