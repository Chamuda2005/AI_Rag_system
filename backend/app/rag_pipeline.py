from app.config import DATA_DIR
from app.document_loader import load_document
from app.chunker import chunk_text
from app.vector_store import add_chunks
from app.retriever import hybrid_search
from app.llm import generate_answer


def ingest_documents():
    total_chunks = 0

    for file_path in DATA_DIR.iterdir():
        if file_path.suffix.lower() not in [".pdf", ".docx"]:
            continue

        text = load_document(file_path)
        chunks = chunk_text(text)

        add_chunks(chunks, source=file_path.name)
        total_chunks += len(chunks)

    return {
        "message": "Documents ingested successfully",
        "total_chunks": total_chunks
    }


def ingest_single_file(file_path):
    text = load_document(file_path)
    chunks = chunk_text(text)

    add_chunks(chunks, source=file_path.name)

    return {
        "message": "File uploaded and ingested successfully",
        "filename": file_path.name,
        "total_chunks": len(chunks)
    }


def ask_question(question, chat_history=None):
    if chat_history is None:
        chat_history = []

    docs, sources = hybrid_search(question)

    context = "\n\n".join(docs)

    history_text = ""
    for item in chat_history[-5:]:
        history_text += f"User: {item['question']}\nAssistant: {item['answer']}\n"

    prompt = f"""
You are a helpful RAG assistant.

Use only the provided context to answer.
If the answer is not in the context, say:
"I could not find this in the uploaded documents."

Chat history:
{history_text}

Context:
{context}

Question:
{question}
"""

    answer = generate_answer(prompt)

    return {
        "answer": answer,
        "sources": sources
    }