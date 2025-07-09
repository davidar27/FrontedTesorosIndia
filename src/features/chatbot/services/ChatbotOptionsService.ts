/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoriesApi } from '@/services/home/categories';
import { ProductsApi } from '@/services/home/products';
import { ExperiencesApi } from '@/services/home/experiences';
import { PackagesApi } from '@/services/home/packages';
import { 
    ChatbotMenu, 
    ChatbotOption, 
    ProductCategory, 
    ChatbotProduct, 
    ChatbotExperience, 
    ChatbotPackage 
} from '../interfaces/ChatbotOptionsInterfaces';

export class ChatbotOptionsService {
    private static instance: ChatbotOptionsService;
    
    public static getInstance(): ChatbotOptionsService {
        if (!ChatbotOptionsService.instance) {
            ChatbotOptionsService.instance = new ChatbotOptionsService();
        }
        return ChatbotOptionsService.instance;
    }

    // Menú principal
    getMainMenu(): ChatbotMenu {
        return {
            id: 'main_menu',
            title: '¡Hola! Soy Tesorito, tu guía turístico virtual 👋',
            isMainMenu: true,
            options: [
                {
                    id: 'packages',
                    label: 'Ver paquetes disponibles',
                    type: 'main_menu',
                    action: 'show_packages',
                    icon: '🎒',
                    description: 'Explora nuestros paquetes turísticos'
                },
                {
                    id: 'products',
                    label: 'Ver productos disponibles',
                    type: 'main_menu',
                    action: 'show_categories',
                    icon: '🛍️',
                    description: 'Descubre productos artesanales'
                },
                {
                    id: 'experiences',
                    label: 'Ver experiencias disponibles',
                    type: 'main_menu',
                    action: 'show_experiences',
                    icon: '🌟',
                    description: 'Vive experiencias culturales únicas'
                },
                {
                    id: 'chat',
                    label: 'Chatear libremente',
                    type: 'main_menu',
                    action: 'custom',
                    value: 'open_free_chat',
                    icon: '💬',
                    description: 'Hazme cualquier pregunta'
                }
            ]
        };
    }

    // Obtener categorías de productos
    async getProductCategories(): Promise<ProductCategory[]> {
        try {
            const categories = await CategoriesApi.getCategories();
            return categories.map((cat: any) => ({
                id: cat.id,
                name: cat.name,
                productCount: cat.productsCount || 0
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    // Crear menú de categorías
    async getCategoriesMenu(): Promise<ChatbotMenu> {
        const categories = await this.getProductCategories();
        
        const options: ChatbotOption[] = categories.map(cat => ({
            id: `category_${cat.id}`,
            label: cat.name,
            type: 'category',
            action: 'show_products',
            value: cat.id.toString(),
            icon: '📦',
            description: `${cat.productCount || 0} productos disponibles`
        }));

        options.push({
            id: 'back_to_main',
            label: '← Volver al menú principal',
            type: 'back',
            action: 'go_back',
            icon: 'ㅤㅤ'

        });

        return {
            id: 'categories_menu',
            title: 'Categorías de Productos',
            options
        };
    }

    // Obtener productos por categoría
    async getProductsByCategory(categoryId: string): Promise<ChatbotProduct[]> {
        try {
            const products = await ProductsApi.getProducts();
            const category = await this.getCategoryById(parseInt(categoryId));
            
            return products
                .filter((product: any) => product.category === category?.name)
                .map((product: any) => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price || product.priceWithTax || 0,
                    image: product.image,
                    category: product.category,
                    url: `/productos/${product.id}/detalles`
                }));
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Crear menú de productos
    async getProductsMenu(categoryId: string): Promise<ChatbotMenu> {
        const products = await this.getProductsByCategory(categoryId);
        const category = await this.getCategoryById(parseInt(categoryId));
        
        const options: ChatbotOption[] = products.map(product => ({
            id: `product_${product.id}`,
            label: product.name,
            type: 'product',
            action: 'navigate',
            value: product.url,
            icon: '🛍️',
            description: `$${product.price.toLocaleString()}`
        }));

        options.push({
            id: 'back_to_main',
            label: '← Volver al menú principal',
            type: 'back',
            action: 'go_back',
            icon: '⬅️'
        });

        return {
            id: 'products_menu',
            title: `Productos - ${category?.name || 'Categoría'}`,
            options
        };
    }

    // Obtener experiencias
    async getExperiences(): Promise<ChatbotExperience[]> {
        try {
            const experiences = await ExperiencesApi.getExperiences();
            return experiences.map((exp: any) => ({
                id: exp.experience_id || exp.id,
                name: exp.name_experience || exp.name,
                description: exp.description,
                price: exp.price,
                image: exp.image,
                location: exp.location,
                url: `/experiencias/${exp.experience_id || exp.id}`
            }));
        } catch (error) {
            console.error('Error fetching experiences:', error);
            return [];
        }
    }

    // Crear menú de experiencias
    async getExperiencesMenu(): Promise<ChatbotMenu> {
        const experiences = await this.getExperiences();
        
        const options: ChatbotOption[] = experiences.map(exp => ({
            id: `experience_${exp.id}`,
            label: exp.name,
            type: 'experience',
            action: 'navigate',
            value: exp.url,
            icon: '🌟',
            description: exp.location ? `📍 ${exp.location}` : undefined
        }));

        options.push({
            id: 'back_to_main',
            label: '← Volver al menú principal',
            type: 'back',
            action: 'go_back',
            icon: '⬅️'
        });

        return {
            id: 'experiences_menu',
            title: 'Experiencias Culturales',
            options
        };
    }

    // Obtener paquetes
    async getPackages(): Promise<ChatbotPackage[]> {
        try {
            const packages = await PackagesApi.getPackages();
            return packages.map((pkg: any) => ({
                id: pkg.id,
                name: pkg.name,
                description: pkg.description,
                price: pkg.price || 0,
                image: pkg.image,
                duration: pkg.duration,
                url: `/paquetes/${pkg.id}`
            }));
        } catch (error) {
            console.error('Error fetching packages:', error);
            return [];
        }
    }

    // Crear menú de paquetes
    async getPackagesMenu(): Promise<ChatbotMenu> {
        const packages = await this.getPackages();
        
        const options: ChatbotOption[] = packages.map(pkg => ({
            id: `package_${pkg.id}`,
            label: pkg.name,
            type: 'package',
            action: 'navigate',
            value: pkg.url,
            icon: '🎒',
            description: pkg.duration ? `⏱️ ${pkg.duration}` : undefined
        }));

        options.push({
            id: 'back_to_main',
            label: '← Volver al menú principal',
            type: 'back',
            action: 'go_back',
        });

        return {
            id: 'packages_menu',
            title: 'Paquetes Turísticos',
            options
        };
    }

    // Obtener categoría por ID
    private async getCategoryById(id: number): Promise<ProductCategory | null> {
        try {
            const categories = await this.getProductCategories();
            return categories.find(cat => cat.id === id) || null;
        } catch (error) {
            console.error('Error fetching category:', error);
            return null;
        }
    }

    // Obtener menú por ID
    async getMenuById(menuId: string, categoryId?: string): Promise<ChatbotMenu | null> {
        switch (menuId) {
            case 'main_menu':
                return this.getMainMenu();
            case 'categories_menu':
                return this.getCategoriesMenu();
            case 'products_menu':
                if (!categoryId) return null;
                return this.getProductsMenu(categoryId);
            case 'experiences_menu':
                return this.getExperiencesMenu();
            case 'packages_menu':
                return this.getPackagesMenu();
            default:
                return null;
        }
    }
}

export const chatbotOptionsService = ChatbotOptionsService.getInstance(); 