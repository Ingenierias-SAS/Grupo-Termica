import os, json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

ADMIN_KEY = os.getenv("ADMIN_KEY", "termica2025")
DATA_FILE = os.getenv("DATA_FILE", "blogs.json")

app = Flask(__name__)
# Ajusta origins si servirás frontend en otro dominio
CORS(app, resources={r"/api/*": {"origins": "*"}})

def load_blogs():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_blogs(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.get("/api/blogs")
def get_blogs():
    return jsonify(load_blogs())

@app.post("/api/blogs")
def create_blog():
    body = request.get_json(force=True)
    if body.get("admin_key") != ADMIN_KEY:
        return jsonify({"error": "Unauthorized"}), 401

    title = body.get("title", "").strip()
    content = body.get("content", "").strip()
    category = body.get("category", "").strip()
    image = body.get("image", "")  # dataURL base64 opcional

    if not title or not content or category not in ["salud", "saneamiento", "aire"]:
        return jsonify({"error": "Invalid payload"}), 400

    blogs = load_blogs()
    new_id = int(max([b.get("id", 0) for b in blogs], default=0)) + 1
    blog = {
        "id": new_id,
        "title": title,
        "content": content,
        "category": category,
        "image": image
    }
    blogs.append(blog)
    save_blogs(blogs)
    return jsonify({"message": "created", "blog": blog}), 201

@app.put("/api/blogs/<int:blog_id>")
def update_blog(blog_id):
    body = request.get_json(force=True)
    if body.get("admin_key") != ADMIN_KEY:
        return jsonify({"error": "Unauthorized"}), 401

    blogs = load_blogs()
    for b in blogs:
        if b.get("id") == blog_id:
            # Actualiza campos si vienen
            b["title"] = body.get("title", b["title"])
            b["content"] = body.get("content", b["content"])
            b["category"] = body.get("category", b["category"])
            if body.get("image"):  # solo reemplaza si llega una imagen nueva
                b["image"] = body["image"]
            save_blogs(blogs)
            return jsonify({"message": "updated", "blog": b})
    return jsonify({"error": "Not found"}), 404

@app.delete("/api/blogs/<int:blog_id>")
def delete_blog(blog_id):
    body = request.get_json(force=True, silent=True) or {}
    if body.get("admin_key") != ADMIN_KEY:
        return jsonify({"error": "Unauthorized"}), 401

    blogs = load_blogs()
    new_blogs = [b for b in blogs if b.get("id") != blog_id]
    if len(new_blogs) == len(blogs):
        return jsonify({"error": "Not found"}), 404

    save_blogs(new_blogs)
    return jsonify({"message": "deleted"})

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    # debug=True para desarrollo local; desactiva en producción
    app.run(host="0.0.0.0", port=port, debug=True)
