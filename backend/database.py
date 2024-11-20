# FARMSTACK Tutorial - Sunday 13.06.2021 (Updated)

import motor.motor_asyncio
from model import Todo
from pymongo.errors import PyMongoError

# MongoDB Connection
MONGO_URI = 'mongodb+srv://aryan:v35BoDy9MFAx9XDa@cluster0.2cnih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
database = client.TodoList
collection = database.todo

# Fetch a single todo item by title
async def fetch_one_todo(title: str):
    try:
        document = await collection.find_one({"title": title})
        if document:
            return Todo(**document)
        return None
    except PyMongoError as e:
        print(f"Error fetching todo: {e}")
        return None

# Fetch all todo items
async def fetch_all_todos():
    todos = []
    try:
        cursor = collection.find({})
        async for document in cursor:
            todos.append(Todo(**document))
    except PyMongoError as e:
        print(f"Error fetching todos: {e}")
    return todos

# Create a new todo item
async def create_todo(todo: dict):
    try:
        result = await collection.insert_one(todo)
        if result.inserted_id:
            return todo
        return None
    except PyMongoError as e:
        print(f"Error creating todo: {e}")
        return None

# Update a todo item's description by title
async def update_todo(title: str, desc: str):
    try:
        result = await collection.update_one(
            {"title": title}, {"$set": {"description": desc}}
        )
        if result.modified_count > 0:
            updated_document = await collection.find_one({"title": title})
            return Todo(**updated_document)
        return None
    except PyMongoError as e:
        print(f"Error updating todo: {e}")
        return None

# Remove a todo item by title
async def remove_todo(title: str):
    try:
        result = await collection.delete_one({"title": title})
        return result.deleted_count > 0
    except PyMongoError as e:
        print(f"Error deleting todo: {e}")
        return False
