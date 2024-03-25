from flask import Flask, request, json, jsonify

app = Flask(__name__)

@app.route("/test", methods=['POST'])
def test():
    data = request.get_json()
    print("Request: ", data)

    response = {
        "employee_id": 10383824,
        "alias": data["name"] + "-amazonian"
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)
