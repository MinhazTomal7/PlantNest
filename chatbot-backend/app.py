# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import PlantNestBot  # your chatbot logic

app = Flask(__name__)
CORS(app)  # allow frontend access from different port

bot = PlantNestBot()

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "No message provided"}), 400

    response = bot.get_response(message)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
