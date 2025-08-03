import os
import sys
import json
import pickle
import faiss
import numpy as np
from pymongo import MongoClient
from bson import ObjectId
from sentence_transformers import SentenceTransformer

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "PlantNest"
PRODUCT_COLLECTION = "products"
PRODUCT_DETAILS_COLLECTION = "productdetails"
FAQ_JSON_PATH = "faq.json"
INDEX_PATH = "vector.index"
METADATA_PATH = "metadata.pkl"
MODEL_NAME = "all-MiniLM-L6-v2"
BATCH_SIZE = 64

def connect_db(uri, db_name):
    client = MongoClient(uri)
    return client[db_name]

def load_products(db):
    prods = list(db[PRODUCT_COLLECTION].find())
    details = list(db[PRODUCT_DETAILS_COLLECTION].find())
    if not prods or not details:
        raise RuntimeError("Empty products or product details collection")
    prod_map = {}
    for p in prods:
        prod_map[str(p["_id"])] = p
    merged = []
    for d in details:
        pid = d.get("productID")
        pid_str = str(pid) if isinstance(pid, ObjectId) else pid
        if pid_str in prod_map:
            p = prod_map[pid_str]
            des = d.get("desAndCare", "")
            text = f"{p.get('title','')} {des}"
            merged.append({
                "text": text,
                "title": p.get("title",""),
                "category": p.get("category",""),
                "brand": p.get("brand",""),
                "potColor": d.get("potColor",""),
                "plantSize": d.get("plantSize",""),
                "desAndCare": des
            })
    if not merged:
        raise RuntimeError("No matching product-details pairs found")
    return merged

def load_faqs(path):
    if not os.path.isfile(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        faqs = json.load(f)
    faqs_clean = []
    for item in faqs:
        q = item.get("question","").strip()
        a = item.get("answer","").strip()
        if q and a:
            faqs_clean.append({"text": f"FAQ: {q}", "answer": a})
    return faqs_clean

def build_corpus(products, faqs):
    corpus_texts = [p["text"] for p in products] + [f["text"] for f in faqs]
    metadata = [{"type":"product", **p} for p in products] + [{"type":"faq", **f} for f in faqs]
    return corpus_texts, metadata

def encode_corpus(corpus, model):
    embeddings = []
    for start in range(0, len(corpus), BATCH_SIZE):
        batch = corpus[start:start+BATCH_SIZE]
        batch_emb = model.encode(batch, show_progress_bar=False, convert_to_numpy=True)
        embeddings.append(batch_emb)
    return np.vstack(embeddings)

def main():
    try:
        db = connect_db(MONGO_URI, DB_NAME)
        products = load_products(db)
        faqs = load_faqs(FAQ_JSON_PATH)
        corpus, metadata = build_corpus(products, faqs)
        model = SentenceTransformer(MODEL_NAME)
        embeddings = encode_corpus(corpus, model)
        dim = embeddings.shape[1]
        index = faiss.IndexFlatL2(dim)
        index.add(embeddings.astype(np.float32))
        faiss.write_index(index, INDEX_PATH)
        with open(METADATA_PATH, "wb") as f:
            pickle.dump(metadata, f)
        print(f"Successfully built embeddings for {len(corpus)} items.")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
