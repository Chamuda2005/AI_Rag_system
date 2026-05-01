import uuid
import chromadb

from app.config import CHROMA_DIR, COLLECTION_NAME
from app.embedding import get_embedding

chroma_client = chromadb.PersistentClient(path=str(CHROMA_DIR))

collection = chroma_client.get_or_create_collection(
    name=COLLECTION_NAME
)


def add_chunks(chunks, source):
    for chunk in chunks:
        collection.add(
            ids=[str(uuid.uuid4())],
            documents=[chunk],
            embeddings=[get_embedding(chunk)],
            metadatas=[{"source": source}]
        )


def get_collection():
    return collection