from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware 
from starlette.middleware.base import BaseHTTPMiddleware
from urllib.parse import urlparse

from app.api import word

app = FastAPI(
    title="User Management API",
    description="A simple CRUD API for managing users",
    version="1.0.0"
)

def is_allowed_subdomain(origin: str) -> bool:
    try:
        parsed_url = urlparse(origin)
        hostname = parsed_url.hostname
        return (
            hostname == "localhost" or
            hostname == "mydomain.com" or
            hostname.endswith(".mydomain.com")
        )
    except Exception:
        return False

class CustomCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin")

        if origin and not is_allowed_subdomain(origin):
            return JSONResponse(
                status_code=403,
                content={"detail": "Origin not allowed"}
            )

        response: Response = await call_next(request)

        if origin and is_allowed_subdomain(origin):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE"
            response.headers["Access-Control-Allow-Headers"] = "*"

        return response

# Gắn middleware đã tự định nghĩa
app.add_middleware(CustomCORSMiddleware)

# Đăng ký router
app.include_router(word.router)
