# AI RAG System

This project is a simple Retrieval-Augmented Generation (RAG) system that allows users to upload PDF files through a web interface and ask questions based on the uploaded documents.

## Features

- PDF upload through frontend
- PDF text extraction
- Text chunking
- Vector embedding using Google AI Studio API
- ChromaDB vector database
- Hybrid search using vector search and BM25 keyword search
- Gemini LLM answer generation
- Chat history support
- Source document display
- Modern Next.js frontend
- FastAPI backend

## Technologies Used

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- Python
- FastAPI
- ChromaDB
- Google Gemini API
- PyPDF
- Rank BM25

## Project Structure

```txt
AI_Rag_system/
├── backend/
│   ├── app/
│   ├── data/
│   ├── chroma_db/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   └── app/
│
├── notebooks/
│   └── rag_test.ipynb
│
├── .gitignore
└── README.md
