import re


def clean_markdown(text: str) -> str:
    """
    Convert Markdown formatted text into readable plain text.
    """

    # Remove images:
    # ![Alt Text](image.jpg) -> Alt Text
    text = re.sub(
        r"!\[([^\]]*)\]\([^)]+\)",
        r"\1",
        text
    )

    # Convert links:
    # [GitHub](https://github.com) -> GitHub
    text = re.sub(
        r"\[([^\]]+)\]\([^)]+\)",
        r"\1",
        text
    )

    # Remove headings:
    # # Heading -> Heading
    # ## Heading -> Heading
    text = re.sub(
        r"^\s{0,3}#{1,6}\s+",
        "",
        text,
        flags=re.MULTILINE
    )

    # Remove bold:
    # **bold** -> bold
    # __bold__ -> bold
    text = re.sub(
        r"\*\*(.*?)\*\*",
        r"\1",
        text,
        flags=re.DOTALL
    )

    text = re.sub(
        r"__(.*?)__",
        r"\1",
        text,
        flags=re.DOTALL
    )

    # Remove italic:
    # *italic* -> italic
    # _italic_ -> italic
    text = re.sub(
        r"(?<!\*)\*(?!\s)(.*?)(?<!\s)\*(?!\*)",
        r"\1",
        text,
        flags=re.DOTALL
    )

    text = re.sub(
        r"(?<!\w)_(?!\s)(.*?)(?<!\s)_(?!\w)",
        r"\1",
        text,
        flags=re.DOTALL
    )

    # Remove inline code:
    # `python` -> python
    text = re.sub(
        r"`([^`]*)`",
        r"\1",
        text
    )

    # Remove fenced code block markers:
    # ```python
    # ```
    text = re.sub(
        r"^```[\w+-]*\s*$",
        "",
        text,
        flags=re.MULTILINE
    )

    # Remove blockquote marker:
    # > Hello -> Hello
    text = re.sub(
        r"^\s*>\s?",
        "",
        text,
        flags=re.MULTILINE
    )

    # Remove unordered list markers:
    # - Python -> Python
    # * Python -> Python
    # + Python -> Python
    text = re.sub(
        r"^\s*[-*+]\s+",
        "",
        text,
        flags=re.MULTILINE
    )

    # Remove numbered list markers:
    # 1. Python -> Python
    # 2. Docker -> Docker
    text = re.sub(
        r"^\s*\d+\.\s+",
        "",
        text,
        flags=re.MULTILINE
    )

    # Remove task list markers:
    # - [x] Done -> Done
    # - [ ] Todo -> Todo
    text = re.sub(
        r"^\s*[-*+]\s+\[[ xX]\]\s+",
        "",
        text,
        flags=re.MULTILINE
    )

    # Remove horizontal rules:
    # ---
    # ***
    # ___
    text = re.sub(
        r"^\s*([-*_])(?:\s*\1){2,}\s*$",
        "",
        text,
        flags=re.MULTILINE
    )

    # Remove HTML tags:
    # <strong>Hello</strong> -> Hello
    text = re.sub(
        r"<[^>]+>",
        "",
        text
    )

    # Remove remaining Markdown escape characters:
    # \* -> *
    # \_ -> _
    # \# -> #
    text = re.sub(
        r"\\([\\`*{}\[\]()#+.!_\-])",
        r"\1",
        text
    )

    # Clean trailing spaces
    text = re.sub(
        r"[ \t]+",
        " ",
        text
    )

    # Remove spaces at the beginning/end of lines
    text = re.sub(
        r"^[ \t]+|[ \t]+$",
        "",
        text,
        flags=re.MULTILINE
    )

    # Keep maximum two consecutive newlines
    text = re.sub(
        r"\n{3,}",
        "\n\n",
        text
    )

    return text.strip()