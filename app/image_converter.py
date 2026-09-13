"""
Image conversion utilities for CKMHTO.AI.
"""


SUPPORTED_INPUT_FORMATS = [
    "jpeg",
    "jpg",
]

SUPPORTED_OUTPUT_FORMATS = [
    "jpg",
]


def get_supported_formats():
    """Return supported image conversion formats."""
    return {
        "input": SUPPORTED_INPUT_FORMATS,
        "output": SUPPORTED_OUTPUT_FORMATS,
    }