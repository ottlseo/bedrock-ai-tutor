from backend.bedrock import call_claude_v3, generate_prompt
from backend.variables import HAIKU, SONNET, BUSINESS_CONVERSATION, CASUAL_CONVERSATION, NORMAL_CONVERSATION_USING_HAIKU, NORMAL_CONVERSATION_USING_SONNET
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/haiku", methods=['POST'])
def haiku():
    data = request.get_json()
    response = call_claude_v3(
        model=HAIKU,
        prompt=generate_prompt(data["prompt"], option=NORMAL_CONVERSATION_USING_HAIKU)
        )
    return response

@app.route("/sonnet", methods=['POST'])
def sonnet():
    data = request.get_json()
    response = call_claude_v3(
        model=SONNET,
        prompt=generate_prompt(data["prompt"], option=NORMAL_CONVERSATION_USING_SONNET)
        )
    return response

@app.route("/business", methods=['POST'])
def business():
    data = request.get_json()
    response = call_claude_v3(
        model=SONNET,
        prompt=generate_prompt(data["prompt"], option=BUSINESS_CONVERSATION)
        )
    return response

@app.route("/casual", methods=['POST'])
def casual():
    data = request.get_json()
    response = call_claude_v3(
        model=SONNET,
        prompt=generate_prompt(data["prompt"], option=CASUAL_CONVERSATION)
        )
    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8081)
