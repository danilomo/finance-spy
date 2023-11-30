from fastapi import FastAPI
from .routers import routers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

for router in routers:
    app.include_router(router)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
