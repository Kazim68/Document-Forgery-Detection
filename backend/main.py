# uvicorn main:app --reload
# To run the server, use the command above in the terminal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, inference, admin, signature, security
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from slowapi.middleware import SlowAPIMiddleware
from utils.rate_limiter import limiter 


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://document-forgery-detection.vercel.app"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add SlowAPI rate limiting middleware
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# Custom exception handler for rate limiting
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"success": False, "detail": "Too many requests. Please try again later."}
    )


app.include_router(auth.router, prefix="/auth")
app.include_router(inference.router, prefix="/model")
app.include_router(admin.router, prefix="/admin")
app.include_router(signature.router, prefix="/documents")
app.include_router(security.router, prefix="/security")
