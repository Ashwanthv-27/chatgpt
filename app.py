from flask import Flask, render_template,request,jsonify
from chatbot import main

app = Flask(__name__)


@app.get("/")
def index_get():
    return render_template("base.html")

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    response=main(text)
    message={"answer":response}
    print(message)
    return jsonify(message)

if __name__=="__main__":
    app.run()
