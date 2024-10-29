#!/usr/bin/env python3
"""Simple Pagination"""

import csv
import math
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Calculate the start and end indexes of a given page and page size
    """

    start = (page - 1) * page_size
    end = start + page_size
    return (start, end)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
            """
            Get a specific page of the dataset
            """
            # check to be sure that the page and page size are positive integers.
            assert isinstance(page, int) and page > 0, "Page number must be a positive integer"
            assert isinstance(page_size, int) and page_size > 0, "Page size must be a positive integer"

            dataset = self.dataset()

            # Calculate the start and end indexes for the requested page
            start, end = index_range(page, page_size)

            # Check if the requested page is within the bounds of the dataset
            if start >= len(dataset):
                return []
            
            return dataset[start:end]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Get a page of the dataset along with pagination metadata.
        """
        
        data = self.get_page(page, page_size)

        total_items = len(self.dataset())
        total_pages = math.ceil(total_items / page_size)

        # Calculate next page
        if page < total_pages:
            next_page = page + 1
        else:
            next_page = None

        # Calculate previous page
        if page > 1:
            prev_page = page - 1
        else:
            prev_page = None

        # Get the actual page size (might be smaller for the last page)
        current_page_size = len(data)

        # Return the hyperlinked pagination data
        return {
            'page_size': current_page_size,
            'page': page,
            'data': data,
            'next_page': next_page,
            'prev_page': prev_page,
            'total_pages': total_pages
        }
        