import numpy as np
from rank_bm25 import BM25Okapi

from app.embedding import get_embedding
from app.vector_store import get_collection


def hybrid_search(question, top_k=5):
    collection = get_collection()

    query_embedding = get_embedding(question)

    vector_results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    vector_docs = vector_results["documents"][0]
    vector_sources = vector_results["metadatas"][0]

    all_data = collection.get()
    all_docs = all_data["documents"]
    all_sources = all_data["metadatas"]

    if not all_docs:
        return [], []

    tokenized_docs = [doc.lower().split() for doc in all_docs]
    bm25 = BM25Okapi(tokenized_docs)

    scores = bm25.get_scores(question.lower().split())
    top_indexes = np.argsort(scores)[::-1][:top_k]

    keyword_docs = [all_docs[i] for i in top_indexes]
    keyword_sources = [all_sources[i] for i in top_indexes]

    final_docs = []
    final_sources = []

    for doc, source in zip(
        vector_docs + keyword_docs,
        vector_sources + keyword_sources
    ):
        if doc not in final_docs:
            final_docs.append(doc)
            final_sources.append(source)

    return final_docs[:top_k], final_sources[:top_k]