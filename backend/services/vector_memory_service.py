import chromadb

# Initialize chromadb client and collection safely to prevent crash if dependency or database folder cannot be loaded
try:
    client = chromadb.PersistentClient(
        path="./chroma_db"
    )
    collection = client.get_or_create_collection(
        name="user_memories"
    )
except Exception as e:
    print(f"Warning: Failed to initialize ChromaDB: {e}")
    client = None
    collection = None

def save_memory(user_id, content):
    if collection is None:
        return
    try:
        collection.add(
            documents=[content],
            ids=[f"{user_id}_{hash(content)}"],
            metadatas=[
                {
                    "user_id": user_id
                }
            ]
        )
    except Exception as e:
        print(f"Warning: Failed to save memory to ChromaDB: {e}")

def retrieve_memories(user_id, query):
    if collection is None:
        return []
    try:
        result = collection.query(
            query_texts=[query],
            n_results=5,
            where={
                "user_id": user_id
            }
        )

        if result and "documents" in result and result["documents"]:
            return result["documents"][0]
    except Exception as e:
        print(f"Warning: Failed to retrieve memories from ChromaDB: {e}")

    return []