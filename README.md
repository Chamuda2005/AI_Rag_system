# AI RAG System

This project is a simple **Retrieval-Augmented Generation (RAG)** system that allows users to upload PDF files through a web interface and ask questions based on the uploaded documents.

---

## 🚀 Features

- PDF upload through frontend  
- PDF text extraction  
- Text chunking  
- Vector embedding using Google AI Studio API  
- ChromaDB vector database  
- Hybrid search (vector search + BM25 keyword search)  
- Gemini LLM answer generation  
- Chat history support  
- Source document display  
- Modern Next.js frontend  
- FastAPI backend  

---

## 🛠 Technologies Used

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

## 📁 Project Structure

```text
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
```

---

## 💻 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/Chamuda2005/AI_Rag_system.git
cd AI_Rag_system
```

### 2. Create a virtual environment
```bash
python -m venv .venv
```
### 3. Activate the virtual environment
```bash
.venv\Scripts\activate
```
### 4. Install backend dependencies
```bash
pip install -r backend/requirements.txt
```
### 5. Create .env file
```bash
GOOGLE_API_KEY=your_google_ai_studio_api_key
```
### 6. Run the backend
```bash
cd backend
uvicorn main:app --reload
```
Backend runs on:
http://127.0.0.1:8000

### 7. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on:
http://localhost:3000


## How It Works

1. The user uploads a PDF file from the frontend.
2. The backend saves the uploaded PDF.
3. Text is extracted from the PDF.
4. Extracted text is divided into smaller chunks.
5. Each chunk is converted into embeddings.
6. Embeddings are stored in ChromaDB.
7. The user asks a question.
8. The system performs hybrid search.
9. Relevant chunks are sent to the Gemini LLM.
10. The answer is displayed in the frontend with sources.
