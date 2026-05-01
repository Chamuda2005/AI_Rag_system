import shutil

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from app.config import DATA_DIR
from app.rag_pipeline import ingest_documents, ask_question, ingest_single_file

app = FastAPI(title="AI RAG Project API")

DATA_DIR.mkdir(exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI RAG Backend is running"
    }


@app.post("/ingest")
def ingest():
    return ingest_documents()


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {
            "error": "Only PDF files are allowed"
        }

    safe_filename = file.filename.replace(" ", "_")
    file_path = DATA_DIR / safe_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return ingest_single_file(file_path)


@app.post("/ask")
def ask(data: dict):
    question = data.get("question")
    chat_history = data.get("chat_history", [])

    if not question:
        return {
            "error": "Question is required"
        }

    return ask_question(question, chat_history)