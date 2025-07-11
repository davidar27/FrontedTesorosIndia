export interface DetectedIntent {
    type: string;
    confidence: number;
    redirectTo: string;
    message: string;
    buttonText: string;
}

// Alias para compatibilidad con la respuesta del backend
export type IntentFromBackend = DetectedIntent;

export class IntentDetectionService {
    private static instance: IntentDetectionService;

    public static getInstance(): IntentDetectionService {
        if (!IntentDetectionService.instance) {
            IntentDetectionService.instance = new IntentDetectionService();
        }
        return IntentDetectionService.instance;
    }

    // Patrones de palabras clave para cada intención
    private readonly patterns = {
        packages: [
            'paquete', 'paquetes', 'tour', 'tours', 'viaje', 'viajes', 'excursión', 'excursiones',
            'combo', 'combos', 'oferta', 'ofertas', 'promoción', 'promociones', 'plan', 'planes',
            'ruta', 'rutas', 'itinerario', 'itinerarios', 'programa', 'programas'
        ],
        products: [
            'producto', 'productos', 'artesanía', 'artesanías', 'souvenir', 'souvenirs',
            'regalo', 'regalos', 'compra', 'compras', 'tienda', 'tiendas', 'mercado', 'mercados',
            'artículo', 'artículos', 'objeto', 'objetos', 'manualidad', 'manualidades'
        ],
        top_products: [
            'más vendido', 'más vendidos', 'mejor vendido', 'mejor vendidos', 'top', 'ranking',
            'popular', 'populares', 'exitoso', 'exitosos', 'rendimiento', 'ventas', 'estadísticas',
            'mejor', 'destacado', 'destacados', 'favorito', 'favoritos', 'trending'
        ],
        experiences: [
            'experiencia', 'experiencias', 'actividad', 'actividades', 'evento', 'eventos',
            'taller', 'talleres', 'clase', 'clases', 'workshop', 'workshops', 'cultura', 'cultural',
            'tradición', 'tradiciones', 'ritual', 'rituales', 'ceremonia', 'ceremonias'
        ],
        categories: [
            'categoría', 'categorías', 'tipo', 'tipos', 'clase', 'clases', 'variedad', 'variedades',
            'sección', 'secciones', 'rubro', 'rubros', 'familia', 'familias'
        ]
    };

    // Mensajes de respuesta para cada intención
    private readonly responses = {
        packages: {
            message: "¡Perfecto! Te ayudo a explorar nuestros paquetes turísticos. Aquí tienes acceso directo:",
            buttonText: "Ver paquetes disponibles",
            redirectTo: "show_packages"
        },
        products: {
            message: "¡Excelente elección! Te muestro nuestras categorías de productos artesanales:",
            buttonText: "Ver productos disponibles",
            redirectTo: "show_categories"
        },
        top_products: {
            message: "¡Genial! Te muestro los productos con mejor rendimiento de ventas:",
            buttonText: "Ver productos más vendidos",
            redirectTo: "show_top_products"
        },
        experiences: {
            message: "¡Genial! Te presento nuestras experiencias culturales únicas:",
            buttonText: "Ver experiencias disponibles",
            redirectTo: "show_experiences"
        },
        categories: {
            message: "¡Por supuesto! Te muestro todas nuestras categorías de productos:",
            buttonText: "Ver categorías",
            redirectTo: "show_categories"
        }
    };

    /**
     * Detecta la intención del usuario basándose en el texto del mensaje
     */
    detectIntent(userMessage: string): DetectedIntent {
        const normalizedMessage = this.normalizeText(userMessage);
        // Calcular puntuación para cada tipo de intención
        const scores = {
            packages: this.calculateScore(normalizedMessage, this.patterns.packages),
            products: this.calculateScore(normalizedMessage, this.patterns.products),
            top_products: this.calculateScore(normalizedMessage, this.patterns.top_products),
            experiences: this.calculateScore(normalizedMessage, this.patterns.experiences),
            categories: this.calculateScore(normalizedMessage, this.patterns.categories)
        };
        // Encontrar la intención con mayor puntuación
        const maxScore = Math.max(...Object.values(scores));
        const detectedType = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) as keyof typeof scores;
        // Si la puntuación es muy baja, no detectar intención
        if (maxScore < 0.3) {
            return {
                type: 'none',
                confidence: 0,
                redirectTo: '',
                message: '',
                buttonText: ''
            };
        }

        const response = this.responses[detectedType];
        return {
            type: detectedType,
            confidence: maxScore,
            redirectTo: response.redirectTo,
            message: response.message,
            buttonText: response.buttonText
        };
    }

    /**
     * Normaliza el texto para mejorar la detección
     */
    private normalizeText(text: string): string {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover acentos
            .replace(/[^\w\s]/g, ' ') // Remover puntuación
            .replace(/\s+/g, ' ') // Normalizar espacios
            .trim();
    }

    /**
     * Calcula la puntuación de coincidencia para un conjunto de patrones
     */
    private calculateScore(text: string, patterns: string[]): number {
        let score = 0;
        const words = text.split(' ');
        let matches = 0;

        for (const pattern of patterns) {
            for (const word of words) {
                // Coincidencia exacta
                if (word === pattern) {
                    score += 1.0;
                    matches++;
                }
                // Coincidencia parcial (la palabra contiene el patrón)
                else if (word.includes(pattern) || pattern.includes(word)) {
                    // Evitar falsos positivos con palabras muy cortas
                    if (word.length >= 3 && pattern.length >= 3) {
                        score += 0.7;
                        matches++;
                    }
                }
                // Coincidencia de similitud (para palabras similares)
                else if (this.calculateSimilarity(word, pattern) > 0.8) {
                    score += 0.5;
                    matches++;
                }
            }
        }

        // Si no hay coincidencias, retornar 0
        if (matches === 0) {
            return 0;
        }

        // Normalizar la puntuación basada en el número de palabras del texto
        // Esto evita que textos largos tengan puntuaciones artificialmente bajas
        const normalizedScore = score / Math.max(words.length, 1);

        // Aplicar un boost si hay múltiples coincidencias
        const boost = matches > 1 ? Math.min(matches * 0.2, 0.5) : 0;

        const finalScore = Math.min(normalizedScore + boost, 1.0);
        return finalScore;
    }

    /**
     * Calcula la similitud entre dos palabras usando distancia de Levenshtein
     */
    private calculateSimilarity(word1: string, word2: string): number {
        const longer = word1.length > word2.length ? word1 : word2;
        const shorter = word1.length > word2.length ? word2 : word1;

        if (longer.length === 0) return 1.0;

        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    /**
     * Calcula la distancia de Levenshtein entre dos strings
     */
    private levenshteinDistance(str1: string, str2: string): number {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Verifica si el mensaje contiene palabras de pregunta
     */
    isQuestion(message: string): boolean {
        const questionWords = [
            'qué', 'que', 'cual', 'cuál', 'como', 'cómo', 'donde', 'dónde',
            'cuando', 'cuándo', 'por que', 'por qué', 'quien', 'quién',
            'cuanto', 'cuánto', 'cuanta', 'cuánta', 'cuantos', 'cuántos',
            'cuantas', 'cuántas', 'hay', 'tienen', 'ofrecen', 'muestran',
            'disponible', 'disponibles', 'ver', 'mostrar', 'enseñar'
        ];

        const normalizedMessage = this.normalizeText(message);
        return questionWords.some(word => normalizedMessage.includes(word));
    }
}

export const intentDetectionService = IntentDetectionService.getInstance(); 