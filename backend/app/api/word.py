from app.schemas.word import GenWordResponse
from app.crud import word as crud_word
import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import json
from threading import Timer
import time

router = APIRouter()

def remove_file_later(path, delay=300):
    """Xóa file sau `delay` giây (mặc định 5 phút)"""
    def delete_file():
        if os.path.exists(path):
            os.remove(path)
    Timer(delay, delete_file).start()

@router.post("/convert", response_model=GenWordResponse)
def convert_json_to_word(file: UploadFile = File(...)):
    try:
        content = file.file.read()
        data = json.loads(content)  # Chuyển từ bytes sang dict
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON file: {str(e)}")

    # Hàm này tạo file Word và lưu tại filepath
    doc_id, filepath = crud_word.generate_word_from_json(data)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=500, detail="File conversion failed")

    # Lên lịch xóa file sau kể cả khi người dùng có tải về hay ko sau 5p
    remove_file_later(filepath, delay=300)
    return GenWordResponse(doc_id=doc_id, exist_time=300)


@router.get("/download/{doc_id}")
def download_word_file(doc_id: str):
    filepath = crud_word.get_filepath_by_docID(doc_id)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")

    # Lên lịch xóa file sau khi trả về
    # remove_file_later(filepath, delay=60)

    res = FileResponse(
        filepath,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="converted.docx"
    )
    return res


# @router.post("/convert")
# def convert_json_to_word(file: UploadFile = File(...)):
#     try:
#         content = file.file.read()
#         data = json.loads(content)  # Chuyển từ bytes sang dict
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Invalid JSON file: {str(e)}")

#     doc_id = crud_word.generate_word_from_json(data)  # Tạo file Word, trả về doc_id
#     # download_url = f"/api/word/download/{doc_id}"

#     filepath = f"{doc_id}.docx"
#     if not os.path.exists(filepath):
#         raise HTTPException(status_code=404, detail="File not found")
#     return {
#         "doc_id": doc_id,
#         # "download_url": download_url
#     }

# @router.get("/download/{doc_id}")
# def download_word_file(doc_id: str):
#     filepath = f"{doc_id}.docx"
#     if not os.path.exists(filepath):
#         raise HTTPException(status_code=404, detail="File not found")
#     return FileResponse(
#     filepath,
#     media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
#     filename="converted.docx"
#     )