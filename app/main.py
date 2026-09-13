from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.cleaner import clean_markdown
from app.image_converter import get_supported_formats


app = FastAPI(
    title="CKMHTO.AI Tools API",
    description="Free online tools by CKMHTO.AI",
    version="1.0.0",
)


class CleanRequest(BaseModel):
    text: str


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "ckmhto-tools",
        "version": "1.0.0",
    }


@app.get("/api/image-formats")
def image_formats():
    return get_supported_formats()


@app.post("/clean")
def clean_text(request: CleanRequest):
    cleaned = clean_markdown(request.text)

    return {
        "original_text": request.text,
        "cleaned_text": cleaned,
    }


app.mount(
    "/",
    StaticFiles(
        directory="app/static",
        html=True,
    ),
    name="static",
)