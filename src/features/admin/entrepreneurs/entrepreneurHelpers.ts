export function formatDate(dateStr: string) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
}