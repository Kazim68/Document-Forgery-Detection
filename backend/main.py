# uvicorn main:app --reload
# To run the server, use the command above in the terminal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, inference, admin, signature


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/auth")
app.include_router(inference.router, prefix="/model")
app.include_router(admin.router, prefix="/admin")
app.include_router(signature.router, prefix="/doc")