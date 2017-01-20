export function formatDate(date: Date): string {
    return `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`;
}

export function parseDateParts(dateString: string): Date {
    let parts = dateString.split('_');

    return new Date(Number.parseInt(parts[0]), Number.parseInt(parts[1]), Number.parseInt(parts[2]))
} 