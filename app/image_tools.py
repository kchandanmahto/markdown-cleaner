"""
Image tools for CKMHTO.AI

Future image processing functions can be added here.
"""


def get_supported_formats():
    """Return currently supported image formats."""
    return {
        "input": ["jpeg", "jpg"],
        "output": ["jpg"]
    }