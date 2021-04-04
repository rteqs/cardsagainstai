from flask import Flask, request
app = Flask(__name__)

from model import ModelInitializer

@app.route("/")
def root():
  return "Root is working!"

@app.route("/score", methods=['POST'])
def score():
    request_data = request.get_json(force=True)
    print(request_data)
    return {'scores': model.score(request_data["texts"])}

if __name__ == "__main__":
    model = ModelInitializer('./models/humor_net2021-04-04 16_50_14.861519.pth')
    app.run()
  