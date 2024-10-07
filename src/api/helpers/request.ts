import { NextResponse } from "next/server";
import { ModelMap, ModelType } from "./types";
import { StatusCodes } from "http-status-codes";

type getFunctionType<T extends ModelType> = (params: any) => Promise<ModelMap[T] | void>;
type postFunctionType<T extends ModelType> = (model: ModelMap[T]) => Promise<ModelMap[T] | void>;


// GET method

export async function getHelper<T extends ModelType>(
    entity: T, 
    func: getFunctionType<T>, 
    params: any): Promise<NextResponse> {

    try {
        const response = await func(params);

        if (!response) {
            return NextResponse.json({ error: `${response} not found` }, { status: StatusCodes.NOT_FOUND});
        }

        return NextResponse.json(response, { status: StatusCodes.OK})
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Server error' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    };
}



// POST method

export async function postHelper<T extends ModelType>(
    entity: T,
    func: postFunctionType<T>,
    modelInstance: ModelMap[T]
): Promise<NextResponse> {

    try {

        // post model
        const response = await func(modelInstance);

        if (!response) {
            return NextResponse.json({
                message: 'POST failed to save',
                data: modelInstance
            }, { status: StatusCodes.BAD_REQUEST})
        }

        return NextResponse.json({
            message: 'POST request received successfully',
            data: response
        }, { status: StatusCodes.CREATED })
    } catch (error) {
        return NextResponse.json({ message: 'Error processing request', error: error}, { status: StatusCodes.INTERNAL_SERVER_ERROR })
    }


}