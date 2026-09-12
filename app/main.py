from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.cleaner import clean_markdown


app = FastAPI(
    title="Markdown Cleaner | CKMHTO.AI",
    description="Free online Markdown to Plain Text Converter by CKMHTO.AI",
    version="1.0.0",
)


class CleanRequest(BaseModel):
    text: str


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "markdown-cleaner",
        "version": "1.0.0",
        "brand": "CKMHTO.AI",
        "author": "Chandan Kumar"
    }


@app.post("/clean")
def clean_text(request: CleanRequest):
    cleaned = clean_markdown(request.text)

    return {
        "original_text": request.text,
        "cleaned_text": cleaned
    }


app.mount(
    "/",
    StaticFiles(
        directory="app/static",
        html=True
    ),
    name="static"
)