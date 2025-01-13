require("dotenv").config();
import "@testing-library/jest-dom";

global.Image = jest.fn().mockImplementation(() => ({
  decode: jest.fn().mockResolvedValue(true),
}));
