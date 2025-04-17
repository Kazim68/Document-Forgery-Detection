from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine
import os
from dotenv import load_dotenv

load_dotenv()

#MONGODB_URI = "mongodb+srv://uchihaItachiTrueHero:UchihaItachiTrueHero@cluster0.swmsudh.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
#client = AsyncIOMotorClient(MONGODB_URI)
engine = AIOEngine(client=client, database="forgery_detection")