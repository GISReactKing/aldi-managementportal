export const PaginationFunc = (length: number) => {
    const countArr = [];
    let i = 10;
    while (i < length) {
        countArr.push(i);
        i = i * 2 == 20 ? 25 : i * 2;
    }
    countArr.push(i);
    return countArr;
}
