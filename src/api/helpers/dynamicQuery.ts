import prisma from "../../lib/prisma";

type ModelType = "category" | "country"
type QueryType = "findMany"

// export async function dynamicQuery(
//     modelName: ModelType, 
//     queryType: QueryType,
//     ): Promise<any> {

//     // Access the model dynamically
//     if (prisma[modelName] && typeof prisma[modelName][queryType] === 'function') {
//         return await prisma[modelName].findFirst({ where: { id: "1"} })
//     }

// }