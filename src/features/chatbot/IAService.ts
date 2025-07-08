// import { HarmCategory, HarmBlockThreshold, GoogleGenAI, GenerateContentConfig } from "@google/genai";
// import dotenv from "dotenv";
// dotenv.config();

// const { AI_API_KEY = "" } = process.env;
// const ai = new GoogleGenAI({ apiKey: AI_API_KEY });
// const SYSTEM_PROMPT = `
//     Eres un asistente de IA del aplicativo web Tesoros de la India. Tu objetivo es ayudar a los usuarios a descubrir y disfrutar de las maravillas culturales de la India.

//     PRINCIPIOS GENERALES:
//     - Responde de manera clara y concisa
//     - Usa formato markdown para mejor legibilidad
//     - Mantén un tono profesional pero amigable
//     - Proporciona información relevante basada en los datos disponibles
//     - Respeta los roles y permisos de los usuarios
//     - Si la pregunta no está relacionada con Tesoros de la India, responde amablemente indicando que solo puedes ayudar con temas del aplicativo
//     - Enfócate en experiencias culturales, productos y paquetes turísticos de la India

//     TEMÁTICAS PRINCIPALES:
//     1. Experiencias culturales indias
//     2. Productos relacionados con las experiencias
//     3. Paquetes turísticos (conjuntos de experiencias)
//     4. Gestión para emprendedores (ventas, productos, etc.)

//     SEGURIDAD:
//     - NO incluyas información sensible (IDs internos, datos personales, tarjetas de crédito)
//     - Respeta los niveles de acceso según el rol del usuario
//     - Proporciona solo información autorizada para cada usuario
// `;
// const globalConfig: GenerateContentConfig = {
//     temperature: 0.35,
//     safetySettings: [
//         {
//             category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//             category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//             category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//         {
//             category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//         },
//     ],
//     systemInstruction: SYSTEM_PROMPT,
// }
// type DataRequirement = {
//     needsExperiences: boolean;
//     needsProducts: boolean;
//     needsPackages: boolean;
//     needsSales: boolean;
//     responseType: 'GENERAL' | 'EXPERIENCE' | 'PRODUCT' | 'PACKAGE' | 'SALES';
// };
// type Roles = "cliente" | "emprendedor" | "administrador" | "observador"

// class IAService {
//     static async getResponse(prompt: string, history: any[], role: Roles = "observador", id_user: number = 0) {
//         try {
//             const dataRequirement = await this.analyzeDataRequirements(prompt, role);
//             const contextData = await this.gatherRequiredData(dataRequirement, id_user, role);
//             const response = await this.generateUnifiedResponse(prompt, history, role, id_user, dataRequirement, contextData);
//             return response;
//         } catch (error) {
//             console.error("Error getting AI response:", error);
//             throw new Error("Failed to get AI response");
//         }
//     }

//     static async analyzeDataRequirements(prompt: string, role: Roles | "observador"): Promise<DataRequirement> {
//         try {
//             const analysisPrompt = `
//                 Analiza la siguiente consulta y determina qué tipo de datos necesitas para responder correctamente en el contexto de Tesoros de la India.
                
//                 Consulta: "${prompt}"
//                 Rol del usuario: ${role}
                
//                 Responde ÚNICAMENTE con un JSON válido sin formato markdown, sin ${"```json ni ```"}. 
//                 El JSON debe estar en formato plano como este ejemplo:
//                 {"needsExperiences": true, "needsProducts": false, "needsPackages": false, "needsSales": false, "responseType": "EXPERIENCE"}
                
//                 Estructura requerida:
//                 {
//                     "needsExperiences": boolean,
//                     "needsProducts": boolean,
//                     "needsPackages": boolean,
//                     "needsSales": boolean,
//                     "responseType": "GENERAL" | "EXPERIENCE" | "PRODUCT" | "PACKAGE" | "SALES"
//                 }
                
//                 Criterios:
//                 - needsExperiences: true si la consulta menciona experiencias, actividades culturales, talleres, eventos
//                 - needsProducts: true si la consulta menciona productos, artículos, souvenirs, manualidades
//                 - needsPackages: true si la consulta menciona paquetes, conjuntos, tours combinados
//                 - needsSales: true si la consulta menciona ventas, estadísticas comerciales (solo para emprendedores)
//                 - responseType: clasifica el tipo principal de respuesta necesaria
                
//                 Ejemplos:
//                 - "¿Qué experiencias ofrecen?" → {"needsExperiences": true, "needsProducts": false, "needsPackages": false, "needsSales": false, "responseType": "EXPERIENCE"}
//                 - "¿Qué productos tienen?" → {"needsExperiences": false, "needsProducts": true, "needsPackages": false, "needsSales": false, "responseType": "PRODUCT"}
//                 - "Recomiéndenme un paquete completo" → {"needsExperiences": false, "needsProducts": false, "needsPackages": true, "needsSales": false, "responseType": "PACKAGE"}
//                 - "Quiero ver mis ventas del último mes" → {"needsExperiences": false, "needsProducts": false, "needsPackages": false, "needsSales": true, "responseType": "SALES"}
//             `;

//             const chat = ai.chats.create({
//                 model: "gemini-2.0-flash",
//                 history: [],
//                 config: globalConfig,
//             });

//             const response: any = await chat.sendMessage({
//                 message: analysisPrompt,
//             });

//             const cleanedResponse = this.extractAndCleanJSON(response.text);
//             return JSON.parse(cleanedResponse);
//         } catch (error) {
//             console.error("Error analyzing data requirements:", error);
//             return {
//                 needsExperiences: false,
//                 needsProducts: false,
//                 needsPackages: false,
//                 needsSales: false,
//                 responseType: 'GENERAL'
//             };
//         }
//     }

//     static async gatherRequiredData(dataRequirement: DataRequirement, id_user: number, role: Roles | "observador") {
//         const contextData: any = {
//             info: await this.formatObject({
//                 appName: "Tesoros de la India",
//                 description: "Plataforma para descubrir experiencias culturales, productos y paquetes turísticos de la India"
//             })
//         };

//         if (dataRequirement.needsExperiences) {
//             try {
//                 // Aquí iría la llamada a tu repositorio de experiencias
//                 const experiences: any = []; // await ExperienceRepository.getAll();
//                 contextData.experiences = await this.formatObject(experiences);
//             } catch (error) {
//                 console.error("Error fetching experiences:", error);
//                 contextData.experiences = "[]";
//             }
//         }

//         if (dataRequirement.needsProducts) {
//             try {
//                 // Aquí iría la llamada a tu repositorio de productos
//                 const products: any = []; // await ProductRepository.getAll();
//                 contextData.products = await this.formatObject(products);
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//                 contextData.products = "[]";
//             }
//         }

//         if (dataRequirement.needsPackages) {
//             try {
//                 // Aquí iría la llamada a tu repositorio de paquetes
//                 const packages: any = []; // await PackageRepository.getAll();
//                 contextData.packages = await this.formatObject(packages);
//             } catch (error) {
//                 console.error("Error fetching packages:", error);
//                 contextData.packages = "[]";
//             }
//         }

//         if (dataRequirement.needsSales && role === "emprendedor" && id_user > 0) {
//             try {
//                 // Aquí iría la llamada a tu repositorio de ventas
//                 const sales: any = []; // await SalesRepository.getByEntrepreneur(id_user);
//                 contextData.sales = await this.formatObject(sales);
//             } catch (error) {
//                 console.error("Error fetching sales:", error);
//                 contextData.sales = "[]";
//             }
//         }

//         return contextData;
//     }

//     static async generateUnifiedResponse(
//         prompt: string,
//         history: any[],
//         role: Roles,
//         id_user: number,
//         dataRequirement: DataRequirement,
//         contextData: any
//     ) {
//         const chat = ai.chats.create({
//             model: "gemini-2.0-flash",
//             history: history,
//             config: globalConfig,
//         });

//         const unifiedPrompt = `
//             Eres un asistente de IA especializado en Tesoros de la India. Responde a la consulta del usuario de manera precisa y útil, enfocándote en la cultura y experiencias indias.

//             INFORMACIÓN DEL CONTEXTO:
//             - Consulta del usuario: "${prompt}"
//             - Rol del usuario: ${role}
//             - ID del usuario: ${id_user}
//             - Tipo de respuesta requerido: ${dataRequirement.responseType}

//             DATOS DISPONIBLES:
//             ${contextData.info ? `Información general:\n${contextData.info}\n` : ''}
//             ${contextData.experiences ? `Experiencias culturales disponibles:\n${contextData.experiences}\n` : ''}
//             ${contextData.products ? `Productos disponibles:\n${contextData.products}\n` : ''}
//             ${contextData.packages ? `Paquetes turísticos disponibles:\n${contextData.packages}\n` : ''}
//             ${contextData.sales ? `Datos de ventas:\n${contextData.sales}\n` : ''}

//             INSTRUCCIONES ESPECÍFICAS SEGÚN EL TIPO DE RESPUESTA:

//             ${dataRequirement.responseType === 'EXPERIENCE' ? `
//             PARA CONSULTAS DE EXPERIENCIAS CULTURALES:
//             - Describe las experiencias con detalles culturales relevantes
//             - Incluye información sobre ubicación, duración u otros detalles
//             - Usa formato markdown: [Nombre de la experiencia](/Experiencia/:id_experiencia)
//             - Si necesitas listar, incluye: nombre, descripción, precio y link
//             ` : ''}

//             ${dataRequirement.responseType === 'PRODUCT' ? `
//             PARA CONSULTAS DE PRODUCTOS:
//             - Menciona materiales, técnicas de fabricación y origen cultural
//             - Usa formato markdown: [Nombre del producto](/Producto/:id_producto)
//             - Incluye: nombre, descripción, precio y link
//             ` : ''}

//             ${dataRequirement.responseType === 'PACKAGE' ? `
//             PARA CONSULTAS DE PAQUETES TURÍSTICOS:
//             - Explica cómo las experiencias se complementan en el paquete
//             - Recomienda paquetes según intereses del usuario
//             - Usa formato markdown: [Nombre del paquete](/Paquete/:id_paquete)
//             ` : ''}

//             ${dataRequirement.responseType === 'SALES' ? `
//             PARA CONSULTAS DE VENTAS (SOLO EMPRENDEDORES):
//             - Proporciona información clara y concisa sobre ventas
//             - Destaca tendencias o patrones importantes
//             - No revelar información sensible o de otros vendedores
//             ` : ''}

//             ${dataRequirement.responseType === 'GENERAL' ? `
//             PARA CONSULTAS GENERALES:
//             - Responde de manera corta y concisa
//             - Promueve el descubrimiento de Tesoros de la India
//             ` : ''}

//             REGLAS GENERALES:
//             - Enfatiza el valor cultural y educativo de las experiencias
//             - NO incluyas información sensible
//             - Usa formato markdown para estilo y enlaces
//             - Si no puedes responder algo, explícalo brevemente
//         `;

//         const response: any = await chat.sendMessage({
//             message: unifiedPrompt,
//         });

//         return this.CleanResponse(response.text);
//     }

//     static extractAndCleanJSON(response: string): string {
//         let cleaned = response.replace(/```json\s*/gi, '').replace(/```/g, '');

//         cleaned = cleaned.trim();

//         const firstBrace = cleaned.indexOf('{');
//         const lastBrace = cleaned.lastIndexOf('}');

//         if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
//             cleaned = cleaned.substring(firstBrace, lastBrace + 1);
//         }

//         return cleaned;
//     }

//     static CleanResponse(response: string) {
//         return response.replace(/^\s+|\s+$/g, "").replace(/\n/g, " ");
//     }

//     static async formatObject(object: any) {
//         return JSON.stringify(object, null, 2);
//     }
// }

// export default IAService;