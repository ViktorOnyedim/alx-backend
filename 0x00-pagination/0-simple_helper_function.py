#!/usr/bin/env python3

def index_range(page: int, page_size: int) -> tuple:
    """
    Calculate the start and end indexes of a given page and page size
    """

    start = (page - 1) * page_size
    end = start + page_size
    return (start, end)