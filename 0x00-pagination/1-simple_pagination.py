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

