from fastapi import FastAPI

app = FastAPI(
    title="SevaSangam API",
    description="Backend API for SevaSangam cooperative-owned digital service marketplace",
    version="0.1.0",
)


@app.get("/")
def read_root():
    return {"message": "Welcome to SevaSangam API"}
