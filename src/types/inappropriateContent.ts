export interface InappropriateContentError {
    success: false;
    message: string;
    error: string;
    toxicCategories: string[];
    suggestion: string;
    severity: 'low' | 'medium' | 'high';
}

export interface InappropriateContentResponse {
    success: boolean;
    message?: string;
    error?: InappropriateContentError;
} 