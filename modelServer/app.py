from flask import Flask, request
app = Flask(__name__)

from model import ModelInitializer

@app.route("/")
def root():
  model.score([
		"Hello there my name is",
		"There is no way these are the same",
		"wow that is funny"
	])
  return "Root is working!"

@app.route("/score", methods=['POST'])
def score():
    request_data = request.get_json(force=True)
    print(request_data)
    return {'scores': model.score(request_data["texts"])}

if __name__ == "__main__":
    model = ModelInitializer('./models/CAH_model_epoch9_2021-04-11 20_56_35.649418.pth') # './models/CAH_model_epoch9_2021-04-11 08_12_42.919066.pth') # './models/humor_net2021-04-04 16_50_14.861519.pth')
    app.run()