#!/usr/bin/env python3
"""
A function that takes two integer arguments 'page' and 'page_size' and
returns a tuple size two containing a start and an end index 
corresponding to the range of indexes to return in a list for those particular pagination parameters.

Page numbers are 1-indexed, i.e the first page is page 1.
"""

import typing


def index_range(page: int, page_size: int) -> typing.Tuple[int, int]:
    """
    Calculate the start and end indexes of a given page and page size
    """

    start = (page - 1) * page_size
    end = start + page_size
    return (start, end)