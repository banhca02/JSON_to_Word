import uuid
import os
from typing import Dict, Any
from app.deps.convert_to_word import create_file_word

TMP_DIR = "tmp_docs"
if not os.path.exists(TMP_DIR):
    os.makedirs(TMP_DIR)


def generate_word_from_json(data: Dict[str, Any]) -> str:  
    # Tạo id file ngẫu nhiên
    doc_id = str(uuid.uuid4())
    filepath = os.path.join(TMP_DIR, f"{doc_id}.docx")
    create_file_word(data, filepath)
    return doc_id, filepath
    
def get_filepath_by_docID(doc_id: str):
    filepath = os.path.join(TMP_DIR, f"{doc_id}.docx")
    return filepath