from pypdf import PdfReader
from docx import Document


def read_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text


def read_docx(file_path):
    doc = Document(file_path)
    return "\n".join([paragraph.text for paragraph in doc.paragraphs])


def load_document(file_path):
    file_path = str(file_path)

    if file_path.endswith(".pdf"):
        return read_pdf(file_path)

    if file_path.endswith(".docx"):
        return read_docx(file_path)

    raise ValueError("Only PDF and DOCX files are supported")