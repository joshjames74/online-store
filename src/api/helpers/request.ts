import { NextResponse } from "next/server";
import { ModelMap, ModelType, TableMap } from "./types.js";
import { Method } from "axios";

export type FieldValuePair<T extends ModelType> = {
  field: TableMap[T];
  value: any;
};

// Define types of CRUD functions

// so many return types are used that generic is better
type GetHandler<T extends ModelType> = (params: any) => Promise<any>;

type PostHandler<T extends ModelType> = (
  model: any,
) => Promise<ModelMap[T] | void>;

type DeleteHandler<T extends ModelType> = (
  params: any,
) => Promise<ModelMap[T] | void>;

type PutHandler<T extends ModelType> = (
  params: any,
) => Promise<ModelMap[T] | void>;

// Messages

type HTTPMessage = {
  success: string;
  failure: string;
  error: string;
};

const generateMessage = (request: Method): HTTPMessage => {
  return {
    success: `${request} request completed successfully`,
    failure: `${request} request failed`,
    error: `Error processing ${request} request`,
  };
};

// Helpers

export function formatBodyToField<T extends ModelType>(
  body: any,
): FieldValuePair<T>[] {
  return Object.entries(body).reduce(
    (obj: any, [key, value]) => [...obj, { field: key, value: value }],
    [],
  );
}

// GET method

export async function getHelper<T extends ModelType>(
  func: GetHandler<T>,
  params?: any,
): Promise<NextResponse> {
  const message = generateMessage("GET");
  try {
    const response = await func(params);
    if (!response) {
      return NextResponse.json({ message: message.failure }, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log((error as any).message);
    return NextResponse.json({ error: message.error }, { status: 500 });
  }
}

// POST method

export async function postHelper<T extends ModelType>(
  entity: T,
  func: PostHandler<T>,
  modelInstance: any,
): Promise<NextResponse> {
  const message = generateMessage("POST");
  try {
    const response = await func(modelInstance);
    if (!response) {
      return NextResponse.json(
        {
          message: message.failure,
          data: modelInstance,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: message.success,
        data: response,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log((error as any).message);
    return NextResponse.json(
      { message: message.error, error: error },
      { status: 500 },
    );
  }
}

// DELETE method

export async function deleteHelper<T extends ModelType>(
  entity: T,
  func: any,
  params: any,
): Promise<NextResponse> {
  try {
    const response = await func(params);

    if (!response) {
      return NextResponse.json({ message: "DELETE failed" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "DELETE request completed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log((error as any).message);
    return NextResponse.json(
      { message: "Error processing request", error: error },
      { status: 500 },
    );
  }
}

// PUT method

export async function putHelper<T extends ModelType>(
  entity: T,
  func: PutHandler<T>,
  params: any,
): Promise<NextResponse> {
  console.log(params);
  try {
    const response = await func(params);

    if (!response) {
      return NextResponse.json({ message: "PUT failed" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "PUT request completed successfully", data: response },
      { status: 200 },
    );
  } catch (error) {
    console.log((error as any).message);
    return NextResponse.json(
      { message: "Error processing request", error: error },
      { status: 500 },
    );
  }
}
