export interface ParsedItem {
    id: string;
    name: string;
    description?: string;
    type: 'package' | 'experience' | 'product';
    url: string;
    image: string;
}

export interface ParsedResponse {
    text: string;
    items: ParsedItem[];
    hasItems: boolean;
}

export class ResponseParser {
    /**
     * Parsea una respuesta de IA y extrae elementos mencionados
     */
    static parseResponse(response: string): ParsedResponse {
        const items: ParsedItem[] = [];
        let cleanText = response;


        // Patrón para detectar enlaces markdown con información de paquetes
        const packagePattern = /\[([^\]]+)\]\(\/Paquete\/(\d+)\)/g;
        const experiencePattern = /\[([^\]]+)\]\(\/Experiencia\/(\d+)\)/g;
        const productPattern = /\[([^\]]+)\]\(\/Producto\/(\d+)\)/g;

        // Extraer paquetes
        cleanText = this.extractItems(cleanText, packagePattern, 'package', items);

        // Extraer experiencias
        cleanText = this.extractItems(cleanText, experiencePattern, 'experience', items);

        // Extraer productos
        cleanText = this.extractItems(cleanText, productPattern, 'product', items);

        // Limpiar el texto de los enlaces markdown
        cleanText = this.cleanMarkdownLinks(cleanText);

        return {
            text: cleanText,
            items,
            hasItems: items.length > 0
        };
    }

    private static extractItems(
        text: string,
        pattern: RegExp,
        type: 'package' | 'experience' | 'product',
        items: ParsedItem[]
    ): string {
        let match;
        let cleanText = text;
        console.log(items);

        while ((match = pattern.exec(text)) !== null) {
            const [, name, id] = match;

            // Buscar descripción en el contexto cercano
            const description = this.findDescription(text, match.index);

            // Buscar imagen en el contexto cercano
            const image = this.findImage(text, match.index);

            items.push({
                id,
                name: this.cleanName(name),
                description,
                type,
                image: image || '',
                url: `/${type === 'package' ? 'paquetes' : type === 'experience' ? 'experiencias' : 'productos'}/${id}${type === 'product' ? '/detalles' : ''}`
            });

            // Reemplazar el enlace markdown con un placeholder
            cleanText = cleanText.replace(match[0], `[ITEM_${items.length - 1}]`);
        }

        return cleanText;
    }

    private static cleanName(name: string): string {
        // Remover asteriscos y otros caracteres de markdown
        return name.replace(/\*\*/g, '').trim();
    }

    private static findDescription(text: string, itemIndex: number): string | undefined {
        // Buscar descripción en las líneas cercanas
        const lines = text.split('\n');
        const itemLineIndex = text.substring(0, itemIndex).split('\n').length - 1;

        // Buscar en las siguientes 2 líneas
        for (let i = itemLineIndex + 1; i < Math.min(itemLineIndex + 3, lines.length); i++) {
            const line = lines[i].trim();
            if (line && !line.includes('[') && !line.includes('*')) {
                return line;
            }
        }

        return undefined;
    }



    private static findImage(text: string, itemIndex: number): string | undefined {
        // Buscar imagen en las líneas cercanas (antes del item)

        const lines = text.split('\n');
        const itemLineIndex = text.substring(0, itemIndex).split('\n').length - 1;

        // Buscar en las 3 líneas anteriores (más contexto)
        for (let i = Math.max(0, itemLineIndex - 3); i < itemLineIndex; i++) {
            const line = lines[i].trim();
            // Patrón para detectar imágenes markdown: ![alt](url)
            const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
            if (imageMatch) {
                return imageMatch[2]; // Retorna la URL de la imagen
            }
        }

        // Si no encuentra imagen específica, buscar en las líneas siguientes
        for (let i = itemLineIndex + 1; i < Math.min(itemLineIndex + 3, lines.length); i++) {
            const line = lines[i].trim();
            const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
            if (imageMatch) {
                return imageMatch[2];
            }
        }

        return undefined;
    }

    private static cleanMarkdownLinks(text: string): string {
        // Remover enlaces markdown restantes
        return text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remover imágenes markdown
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/\[ITEM_\d+\]/g, '') // Remover placeholders de items
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
    }

    /**
     * Detecta si la respuesta contiene elementos que pueden ser renderizados como cards
     */
    static shouldRenderCards(response: string): boolean {
        const patterns = [
            /\[([^\]]+)\]\(\/Paquete\/(\d+)\)/g,
            /\[([^\]]+)\]\(\/Experiencia\/(\d+)\)/g,
            /\[([^\]]+)\]\(\/Producto\/(\d+)\)/g
        ];

        return patterns.some(pattern => pattern.test(response));
    }

    /**
     * Método de prueba para verificar el parsing
     */
    static testParsing(response: string): void {
        console.log('=== TESTING RESPONSE PARSER ===');
        console.log('Original response:', response);

        const result = this.parseResponse(response);
        console.log('Parsed result:', result);

        console.log('Text cleaned:', result.text);
        console.log('Items found:', result.items.length);
        result.items.forEach((item, index) => {
            console.log(`Item ${index}:`, {
                name: item.name,
                description: item.description,
                image: item.image,
                url: item.url
            });
        });
        console.log('=== END TEST ===');
    }

    /**
     * Ejemplo de uso para testing
     */
    static testExample(): void {
        const testResponse = `¡Claro! Aquí tienes los paquetes turísticos disponibles en Tesoros de la India:
![Paquete Aventura Extremas](/images/e6481952-9c42-4b27-890b-b575241861c3-scenery-2428128_1920.webp)
**[Paquete Aventura Extremas](/Paquete/4)**: Incluye canopy, rafting y alojamiento por 2 noches. Precio: $10000.00

![Masajes Villa Maria](/images/masajes-villa-maria.webp)
**[Masajes Villa Maria](/Paquete/5)**: adawdawdawd - Precio: $22222.00

![Recorrido Centro Historico](/images/centro-historico.webp)
**[Recorrido Centro Historico](/Paquete/6)**: Recorrido Centro Historico por la vereda de la india - Precio: $1000000.00

¿Te gustaría saber más sobre alguno de estos paquetes?`;

        this.testParsing(testResponse);
    }
} 