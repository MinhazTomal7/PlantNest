import os
import sys
import json
import pickle
import random
import faiss
from sentence_transformers import SentenceTransformer

FAQ_JSON_PATH = "faq.json"
INDEX_PATH = "vector.index"
METADATA_PATH = "metadata.pkl"
MODEL_NAME = "all-MiniLM-L6-v2"
SIMILARITY_THRESHOLD = 0.45
RANDOM_RECOMMEND_COUNT = 3
TOP_K_RESULTS = 3


class PlantNestBot:
    def __init__(self):
        try:
            self.faqs = self.load_faqs(FAQ_JSON_PATH)
            self.index, self.metadata = self.load_index_and_metadata(INDEX_PATH, METADATA_PATH)
            self.model = SentenceTransformer(MODEL_NAME)
        except Exception as e:
            print(f"Failed to initialize chatbot: {e}", file=sys.stderr)
            raise

    def load_faqs(self, path):
        if not os.path.isfile(path):
            return []
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def load_index_and_metadata(self, index_path, metadata_path):
        if not os.path.isfile(index_path) or not os.path.isfile(metadata_path):
            raise FileNotFoundError("Missing index or metadata file")
        index = faiss.read_index(index_path)
        with open(metadata_path, "rb") as f:
            metadata = pickle.load(f)
        return index, metadata

    def semantic_search(self, query):
        query_emb = self.model.encode([query], convert_to_numpy=True)
        distances, indices = self.index.search(query_emb, TOP_K_RESULTS)
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:
                continue
            item = self.metadata[idx]
            similarity = 1 - dist / 4  # Normalize distance to similarity
            results.append((item, similarity))
        return results

    def faq_answer(self, user_query):
        user_query_lower = user_query.lower()
        for faq in self.faqs:
            question = faq.get("question", "").lower()
            if user_query_lower in question or question in user_query_lower:
                return faq.get("answer", None)
        return None

    def recommend_random(self, count=RANDOM_RECOMMEND_COUNT):
        products = [m for m in self.metadata if m.get("type") == "product"]
        return random.sample(products, min(count, len(products)))

    def is_greeting(self, text):
        return text.lower().strip() in {"hi", "hello", "hey", "greetings"}

    def get_response(self, user_input):
        if not user_input.strip():
            return "Please ask a question."

        if self.is_greeting(user_input):
            return "Hi there! I'm here to help you find and care for your plants."

        direct_answer = self.faq_answer(user_input)
        if direct_answer:
            return direct_answer

        results = self.semantic_search(user_input)
        filtered = [r for r in results if r[1] >= SIMILARITY_THRESHOLD]

        if filtered:
            faqs = []
            products = []
            for item, sim in filtered:
                if item.get("type") == "faq":
                    faqs.append(item.get("answer"))
                elif item.get("type") == "product":
                    products.append(item.get("title"))

            replies = []

            # Add up to 2 FAQ answers
            if faqs:
                replies.extend(faqs[:2])

            # Add product recommendations in one sentence, if any
            if products:
                plant_list = ", ".join(products[:3])
                replies.append(f"You might like these plants: {plant_list}.")

            return "\n".join(replies)

        # Fallback random products
        fallback = self.recommend_random()
        fallback_titles = [p['title'] for p in fallback]
        fallback_str = ", ".join(fallback_titles)
        return f"I couldn't find an exact answer, but here are some plants you might like: {fallback_str}."
