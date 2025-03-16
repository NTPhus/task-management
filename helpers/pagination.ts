interface ObjectPagination {
    currentPage: number,
    limitItem: number,
    skip?: number,
    totalPage?: number
}

const paginationHelper = (objectPagination: ObjectPagination, query: Record<string, any>, countRecords: number): ObjectPagination => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page) || objectPagination.currentPage;
    }
    
    if (query.limit) {
        objectPagination.limitItem = parseInt(query.limit) || objectPagination.limitItem;
    }

    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitItem;

    const totalPage = Math.ceil(countRecords / objectPagination.limitItem);
    objectPagination.totalPage = totalPage;

    return objectPagination;
};

export default paginationHelper;