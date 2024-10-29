#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""


import csv
import math
from typing import List, Dict, Union


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """
        Return a dictionary with pagination information that is resilient to deletions.
        
        Parameters:
        index (int): The starting index of the page (None defaults to 0)
        page_size (int): The size of the page
        
        Returns:
        Dict: A dictionary containing index, next_index, page_size, and data
        """
        # If index is None, default to 0
        if index is None:
            index = 0
            
        # Get the indexed dataset
        indexed_data = self.indexed_dataset()
        
        # Assert that index is valid
        assert index >= 0
        assert index <= len(self.dataset())
        
        # Collect the data for the current page
        data = []
        current_index = index
        items_collected = 0
        
        while items_collected < page_size and current_index < len(self.dataset()):
            if current_index in indexed_data:
                data.append(indexed_data[current_index])
                items_collected += 1
            current_index += 1
            
        # Calculate the next index (it will be the current_index after the loop)
        next_index = current_index
        
        return {
            'index': index,
            'next_index': next_index,
            'page_size': page_size,
            'data': data
        }