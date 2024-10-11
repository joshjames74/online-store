import { NextResponse } from "next/server";
import { ModelMap, ModelType, MultiModelResponse, SingleModelResponse, TableMap } from "./types";

export type FieldValuePair<T extends ModelType> = { field: TableMap[T]; value: any };

type getFunctionType<T extends ModelType> = (params: any) => Promise<ModelMap[T] | ModelMap[T][] | void>;

// Get types

type GetSingleType<T extends ModelType> = (params: any) => Promise<SingleModelResponse<T> | void>;
type GetMultiType<T extends ModelType> = (params: any) => Promise<MultiModelResponse<T> | void>; 


type postFunctionType<T extends ModelType> = (model: ModelMap[T]) => Promise<ModelMap[T] | void>;
type deleteFunctionType<T extends ModelType> = (params: any) => Promise<ModelMap[T] | void>;
type putFunctionType<T extends ModelType> = (searchParam: FieldValuePair<T>, putParam: FieldValuePair<T>[]) => Promise<ModelMap[T] | void>;



// Helpers

export function formatBodyToField<T extends ModelType>(body: any): FieldValuePair<T>[] {
    return Object.entries(body).reduce((obj: any, [key, value] ) => [...obj, { field: key, value: value }], [])
}


// GET method

export async function getHelper<T extends ModelType>(
    entity: T, 
    func: getFunctionType<T>, 
    params: any): Promise<NextResponse> {

    try {
        const response = await func(params);

        if (!response) {
            return NextResponse.json({ error: `${response} not found` }, { status: 404});
        }

        return NextResponse.json(response, { status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    };
}



// POST method

export async function postHelper<T extends ModelType>(
    entity: T,
    func: postFunctionType<T>,
    modelInstance: ModelMap[T]
): Promise<NextResponse> {

    try {

        const response = await func(modelInstance);

        if (!response) {
            return NextResponse.json({
                message: 'POST failed to save',
                data: modelInstance
            }, { status: 400 })
        }

        return NextResponse.json({
            message: 'POST request received successfully',
            data: response
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: 'Error processing request', error: error}, { status: 500 })
    }


}


// DELETE method

export async function deleteHelper<T extends ModelType>(
    entity: T,
    func: deleteFunctionType<T>,
    params: any
): Promise<NextResponse> {

    try {

        const response = await func(params);

        if (!response) {
            return NextResponse.json({ message: 'DELETE failed' }, { status: 400 } );
        }

        return NextResponse.json({ message: 'DELETE request completed successfully' }, { status: 200 } );
    } catch (error) {
        return NextResponse.json({ message: 'Error processing request', error: error }, { status: 500 })
    }
}


// PUT method

export async function putHelper<T extends ModelType>(
    entity: T,
    func: putFunctionType<T>,
    searchData: FieldValuePair<T>,
    putData: FieldValuePair<T>[]
): Promise<NextResponse> {

    try {

        const response = await func(searchData, putData);

        if (!response) {
            return NextResponse.json({ message: 'PUT failed' }, { status: 400 } );
        }

        return NextResponse.json({ message: 'PUT request completed successfully', data: response }, { status: 200 } );
    } catch (error) {
        return NextResponse.json({ message: 'Error processing request', error: error }, { status: 500 })
    }

}