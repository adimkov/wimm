const toolbar = 60;
const header = 20;
const bottomMargin = 6;
const border = 1;
const bottom = 23;
const headerPadding = 4 + 7 + border;

export function calculateRowHeight(browserHeight: number, rowsCount: number): number {
    const toolbar = 60;
    const header = 20;
    const bottomMargin = 6;
    const border = 1;
    return ((browserHeight - toolbar - header - bottomMargin) / rowsCount) - border;
}

export function calculateCellContainerHeight(rowHeight: number): number {
    return rowHeight - header - bottom - headerPadding
}